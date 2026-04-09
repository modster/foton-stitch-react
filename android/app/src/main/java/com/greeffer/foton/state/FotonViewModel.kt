package com.greeffer.foton.state

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.greeffer.foton.data.buildHudValues
import com.greeffer.foton.data.buildInitialUiState
import com.greeffer.foton.data.formatDurationLabel
import com.greeffer.foton.data.parseDurationMs
import com.greeffer.foton.model.CameraModeId
import com.greeffer.foton.model.CameraUiState
import com.greeffer.foton.model.ExifData
import com.greeffer.foton.model.FlashMode
import com.greeffer.foton.model.FotonUiState
import com.greeffer.foton.model.GalleryFilter
import com.greeffer.foton.model.GalleryItem
import com.greeffer.foton.model.GalleryItemType
import com.greeffer.foton.model.GallerySpan
import com.greeffer.foton.model.LongExposureSubMode
import com.greeffer.foton.model.SettingsActionType
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

class FotonViewModel : ViewModel() {
    var uiState by mutableStateOf(buildInitialUiState())
        private set

    fun setCameraPermission(granted: Boolean) {
        updateCamera {
            it.copy(
                hasCameraPermission = granted,
                previewError = if (granted) null else it.previewError,
            )
        }
    }

    fun setPreviewError(message: String?) {
        updateCamera { it.copy(previewError = message) }
    }

    fun setActiveMode(modeId: CameraModeId) {
        updateCamera {
            it.copy(
                activeModeId = modeId,
                isRecording = false,
                recordingElapsedMs = 0L,
                isExposing = false,
                exposureElapsedMs = 0L,
            )
        }
        syncHudValues()
    }

    fun setLongExposureSubMode(subMode: LongExposureSubMode) {
        updateCamera { it.copy(longExposureSubMode = subMode) }
    }

    fun setRecording(active: Boolean) {
        updateCamera {
            it.copy(isRecording = active, recordingElapsedMs = if (active) it.recordingElapsedMs else 0L)
        }
    }

    fun setRecordingElapsed(ms: Long) {
        updateCamera { it.copy(recordingElapsedMs = ms) }
    }

    fun startLongExposure() {
        updateCamera { it.copy(isExposing = true, exposureElapsedMs = 0L) }
    }

    fun stopLongExposure(resetElapsed: Boolean = true) {
        updateCamera {
            it.copy(
                isExposing = false,
                exposureElapsedMs = if (resetElapsed) 0L else it.exposureElapsedMs,
            )
        }
    }

    fun setExposureElapsed(ms: Long) {
        updateCamera { it.copy(exposureElapsedMs = ms) }
    }

    fun setExposureDurationFromPreset(preset: String) {
        setExposureDuration(parseDurationMs(preset))
    }

    fun setExposureDuration(durationMs: Long) {
        updateCamera { it.copy(exposureDurationMs = durationMs) }
        syncHudValues()
    }

    fun setActiveLens(lensId: String) {
        updateCamera { it.copy(activeLensId = lensId) }
    }

    fun setFocusValue(value: Float) {
        updateCamera { it.copy(focusValue = value.coerceIn(0f, 1f)) }
    }

    fun setFocusSupported(supported: Boolean) {
        updateCamera { it.copy(focusSupported = supported) }
    }

    fun toggleGrid() {
        val next = !uiState.camera.showGrid
        applyCameraToggle("grid", next) { it.copy(showGrid = next) }
    }

    fun toggleFocusSlider() {
        updateCamera { it.copy(showFocusSlider = !it.showFocusSlider) }
    }

    fun toggleLevel() {
        val next = !uiState.camera.showLevel
        applyCameraToggle("level", next) { it.copy(showLevel = next) }
    }

    fun toggleHistogram() {
        val next = !uiState.camera.showHistogram
        applyCameraToggle("histogram", next) { it.copy(showHistogram = next) }
    }

    fun toggleOverexposureWarning() {
        val next = !uiState.camera.showOverexposureWarning
        applyCameraToggle("overexposure", next) { it.copy(showOverexposureWarning = next) }
    }

    fun cycleFlash() {
        updateCamera {
            val next = when (it.flashMode) {
                FlashMode.OFF -> FlashMode.ON
                FlashMode.ON -> FlashMode.AUTO
                FlashMode.AUTO -> FlashMode.OFF
            }
            it.copy(flashMode = next)
        }
    }

    fun toggleRaw() {
        val next = !uiState.camera.showRaw
        applyCameraToggle("raw", next) { it.copy(showRaw = next) }
    }

    fun setFilter(mode: GalleryFilter) {
        uiState = uiState.copy(gallery = uiState.gallery.copy(filterMode = mode))
    }

    fun toggleSelectItem(id: String) {
        val selected = uiState.gallery.selectedItemIds.toMutableSet().apply {
            if (contains(id)) remove(id) else add(id)
        }
        uiState = uiState.copy(gallery = uiState.gallery.copy(selectedItemIds = selected))
    }

    fun toggleSetting(id: String) {
        when (id) {
            "grid" -> toggleGrid()
            "raw" -> toggleRaw()
            "level" -> toggleLevel()
            "histogram" -> toggleHistogram()
            "overexposure" -> toggleOverexposureWarning()
            else -> {
                val next = !(uiState.settings.toggleValues[id] ?: false)
                uiState = uiState.copy(
                    settings = uiState.settings.copy(
                        toggleValues = uiState.settings.toggleValues + (id to next),
                    ),
                )
            }
        }
    }

    fun cycleSetting(id: String) {
        val row = uiState.settings.sections
            .flatMap { it.rows }
            .firstOrNull { it.id == id }
            ?: return

        if (row.actionType != SettingsActionType.SELECT || row.selectOptions.isEmpty()) {
            return
        }

        val fallback = row.selectDefault.ifBlank { row.selectOptions.first() }
        val current = uiState.settings.selectValues[id] ?: fallback
        val currentIndex = row.selectOptions.indexOf(current).takeIf { it >= 0 } ?: 0
        val nextValue = row.selectOptions[(currentIndex + 1) % row.selectOptions.size]

        uiState = uiState.copy(
            settings = uiState.settings.copy(
                selectValues = uiState.settings.selectValues + (id to nextValue),
            ),
        )

        if (id == "video-res") {
            syncHudValues()
        }
    }

    fun handleCapturedPhoto(uri: String, longExposure: Boolean = false) {
        prependGalleryItem(
            GalleryItem(
                id = (if (longExposure) "le" else "capture") + "-${System.currentTimeMillis()}",
                type = GalleryItemType.PHOTO,
                src = uri,
                alt = if (longExposure) {
                    "Long exposure ${timestampLabel()}"
                } else {
                    "Captured photo ${timestampLabel()}"
                },
                span = GallerySpan.FULL,
                exif = if (longExposure) {
                    ExifData(
                        shutter = formatDurationLabel(uiState.camera.exposureDurationMs),
                        iso = "100",
                        aperture = "f/11",
                        whiteBalance = "Auto",
                        focalLength = activeFocalLength(),
                    )
                } else {
                    ExifData(
                        shutter = "1/500",
                        iso = "200",
                        aperture = "f/1.8",
                        whiteBalance = "5500K",
                        focalLength = activeFocalLength(),
                    )
                },
            ),
        )
    }

    fun handleRecordedVideo(uri: String) {
        prependGalleryItem(
            GalleryItem(
                id = "video-${System.currentTimeMillis()}",
                type = GalleryItemType.VIDEO,
                src = uri,
                alt = "Recorded video ${timestampLabel()}",
                span = GallerySpan.FULL,
                videoSrc = uri,
            ),
        )
        setRecording(false)
    }

    private fun prependGalleryItem(item: GalleryItem) {
        uiState = uiState.copy(
            gallery = uiState.gallery.copy(items = listOf(item) + uiState.gallery.items),
        )
    }

    private fun activeFocalLength(): String {
        return com.greeffer.foton.data.lensOptions.firstOrNull { it.id == uiState.camera.activeLensId }?.focalLength ?: "26mm"
    }

    private fun timestampLabel(): String {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss", Locale.US))
    }

    private fun applyCameraToggle(
        settingId: String,
        nextValue: Boolean,
        transform: (CameraUiState) -> CameraUiState,
    ) {
        uiState = uiState.copy(
            camera = transform(uiState.camera),
            settings = uiState.settings.copy(
                toggleValues = uiState.settings.toggleValues + (settingId to nextValue),
            ),
        )
    }

    private fun updateCamera(transform: (CameraUiState) -> CameraUiState) {
        uiState = uiState.copy(camera = transform(uiState.camera))
    }

    private fun syncHudValues() {
        val videoResolution = uiState.settings.selectValues["video-res"] ?: "4K @ 30fps"
        updateCamera {
            it.copy(
                hudValues = buildHudValues(
                    modeId = it.activeModeId,
                    videoResolution = videoResolution,
                    exposureDurationMs = it.exposureDurationMs,
                ),
            )
        }
    }
}