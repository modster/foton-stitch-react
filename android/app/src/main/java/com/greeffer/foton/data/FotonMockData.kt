package com.greeffer.foton.data

import com.greeffer.foton.model.CameraLensOption
import com.greeffer.foton.model.CameraModeId
import com.greeffer.foton.model.ExifData
import com.greeffer.foton.model.FotonUiState
import com.greeffer.foton.model.GalleryFilter
import com.greeffer.foton.model.GalleryItem
import com.greeffer.foton.model.GalleryItemType
import com.greeffer.foton.model.GallerySpan
import com.greeffer.foton.model.HudChip
import com.greeffer.foton.model.SettingsActionType
import com.greeffer.foton.model.SettingsSection
import com.greeffer.foton.model.SettingsRow
import com.greeffer.foton.model.SettingsUiState
import com.greeffer.foton.model.CameraUiState
import com.greeffer.foton.model.GalleryUiState

private val durationMap = mapOf(
    "1s" to 1_000L,
    "2s" to 2_000L,
    "5s" to 5_000L,
    "10s" to 10_000L,
    "15s" to 15_000L,
    "30s" to 30_000L,
)

val photoHudChips = listOf(
    HudChip(label = "SHUTTER", value = "1/500", unit = "s"),
    HudChip(label = "ISO", value = "200"),
    HudChip(label = "EV", value = "+0.3"),
    HudChip(label = "WB", value = "5500K"),
    HudChip(label = "f/", value = "1.8"),
)

val videoHudChips = listOf(
    HudChip(label = "FPS", value = "30"),
    HudChip(label = "RES", value = "4K"),
    HudChip(label = "BITRATE", value = "50"),
    HudChip(label = "WB", value = "5500K"),
)

val lensOptions = listOf(
    CameraLensOption(id = "ultra-wide", label = "0.5x", focalLength = "13mm", zoomRatio = 0.0f),
    CameraLensOption(id = "wide", label = "1x", focalLength = "26mm", zoomRatio = 0.2f),
    CameraLensOption(id = "telephoto", label = "2x", focalLength = "52mm", zoomRatio = 0.55f),
    CameraLensOption(id = "super-tele", label = "5x", focalLength = "130mm", zoomRatio = 1.0f),
)

val longExposureDurationPresets = listOf("1s", "2s", "5s", "10s", "15s", "30s", "B")

val settingsSections = listOf(
    SettingsSection(
        id = "capture",
        title = "CAPTURE",
        rows = listOf(
            SettingsRow(id = "raw", iconName = "raw", label = "RAW Capture", actionType = SettingsActionType.TOGGLE),
            SettingsRow(
                id = "jpeg-quality",
                iconName = "image",
                label = "JPEG Quality",
                actionType = SettingsActionType.SELECT,
                selectDefault = "Maximum",
                selectOptions = listOf("Medium", "High", "Maximum"),
            ),
            SettingsRow(id = "grid", iconName = "grid_on", label = "Show Grid", actionType = SettingsActionType.TOGGLE),
        ),
    ),
    SettingsSection(
        id = "video",
        title = "VIDEO",
        rows = listOf(
            SettingsRow(
                id = "video-res",
                iconName = "videocam",
                label = "Video Resolution",
                actionType = SettingsActionType.SELECT,
                selectDefault = "4K @ 30fps",
                selectOptions = listOf("1080p @ 30fps", "1080p @ 60fps", "4K @ 30fps"),
            ),
            SettingsRow(
                id = "stabilization",
                iconName = "stabilization",
                label = "Video Stabilization",
                actionType = SettingsActionType.TOGGLE,
                toggleDefault = true,
            ),
        ),
    ),
    SettingsSection(
        id = "display",
        title = "DISPLAY",
        rows = listOf(
            SettingsRow(id = "level", iconName = "straighten", iconAccent = "tertiary", label = "Level", actionType = SettingsActionType.TOGGLE),
            SettingsRow(id = "histogram", iconName = "bar_chart", iconAccent = "tertiary", label = "Histogram", actionType = SettingsActionType.TOGGLE),
            SettingsRow(id = "overexposure", iconName = "warning", iconAccent = "tertiary", label = "Overexposure Warning", actionType = SettingsActionType.TOGGLE),
        ),
    ),
    SettingsSection(
        id = "storage",
        title = "STORAGE",
        rows = listOf(
            SettingsRow(
                id = "save-location",
                iconName = "folder",
                label = "Save Location",
                actionType = SettingsActionType.SELECT,
                selectDefault = "App Media Folder",
                selectOptions = listOf("App Media Folder", "Gallery Only"),
            ),
            SettingsRow(
                id = "geotag",
                iconName = "location_on",
                label = "Geotag Photos",
                actionType = SettingsActionType.TOGGLE,
                toggleDefault = true,
            ),
        ),
    ),
    SettingsSection(
        id = "about",
        title = "ABOUT",
        rows = listOf(
            SettingsRow(
                id = "version",
                iconName = "info",
                label = "Foton v0.0.1",
                description = "Android Compose port",
                actionType = SettingsActionType.LINK,
            ),
        ),
    ),
)

val galleryItems = listOf(
    GalleryItem(
        id = "gallery-1",
        type = GalleryItemType.PHOTO,
        src = "placeholder:featured-city",
        alt = "Featured photo - city skyline at night",
        span = GallerySpan.FULL,
        isFeatured = true,
        exif = ExifData(shutter = "1/125", iso = "800", aperture = "f/2.8", whiteBalance = "3200K", focalLength = "26mm"),
    ),
    GalleryItem(
        id = "gallery-2",
        type = GalleryItemType.PHOTO,
        src = "placeholder:light-trails",
        alt = "Long exposure light trails",
        span = GallerySpan.HALF,
        exif = ExifData(shutter = "2s", iso = "100", aperture = "f/11", whiteBalance = "5500K", focalLength = "52mm"),
    ),
    GalleryItem(
        id = "gallery-3",
        type = GalleryItemType.PHOTO,
        src = "placeholder:stars",
        alt = "Star trail composition",
        span = GallerySpan.HALF,
        exif = ExifData(shutter = "30s", iso = "1600", aperture = "f/2.8", whiteBalance = "Auto", focalLength = "13mm"),
    ),
    GalleryItem(id = "gallery-4", type = GalleryItemType.PHOTO, src = "placeholder:portrait", alt = "Portrait in natural light", span = GallerySpan.QUARTER),
    GalleryItem(id = "gallery-5", type = GalleryItemType.PHOTO, src = "placeholder:macro", alt = "Close-up macro flower", span = GallerySpan.QUARTER),
    GalleryItem(id = "gallery-6", type = GalleryItemType.PHOTO, src = "placeholder:sunset", alt = "Sunset landscape", span = GallerySpan.HALF),
    GalleryItem(
        id = "gallery-7",
        type = GalleryItemType.PHOTO,
        src = "placeholder:waterfall",
        alt = "Waterfall long exposure",
        span = GallerySpan.HALF,
        exif = ExifData(shutter = "1s", iso = "50", aperture = "f/22", whiteBalance = "6500K", focalLength = "26mm"),
    ),
)

fun parseDurationMs(preset: String): Long {
    return durationMap[preset] ?: 2_000L
}

fun formatDurationLabel(durationMs: Long): String {
    return if (durationMs >= 1_000L) {
        val seconds = durationMs / 1_000f
        if (seconds % 1f == 0f) {
            "${seconds.toInt()}s"
        } else {
            "${"%.1f".format(seconds)}s"
        }
    } else {
        "${durationMs}ms"
    }
}

fun buildHudValues(
    modeId: CameraModeId,
    videoResolution: String = "4K @ 30fps",
    exposureDurationMs: Long = 2_000L,
): List<HudChip> {
    return when (modeId) {
        CameraModeId.VIDEO -> {
            val tokens = videoResolution.split("@").map(String::trim)
            val resolution = tokens.getOrNull(0) ?: "4K"
            val fps = (tokens.getOrNull(1) ?: "30fps").replace("fps", "", ignoreCase = true).trim()
            videoHudChips.map { chip ->
                when (chip.label) {
                    "RES" -> chip.copy(value = resolution)
                    "FPS" -> chip.copy(value = fps)
                    else -> chip
                }
            }
        }

        CameraModeId.LONG_EXPOSURE -> listOf(
            HudChip(label = "EXPOSURE", value = formatDurationLabel(exposureDurationMs)),
            HudChip(label = "ISO", value = "100"),
            HudChip(label = "EV", value = "+0.0"),
            HudChip(label = "WB", value = "Auto"),
        )

        CameraModeId.PHOTO -> photoHudChips
    }
}

fun initialToggleValues(): Map<String, Boolean> {
    return settingsSections
        .flatMap { it.rows }
        .filter { it.actionType == SettingsActionType.TOGGLE }
        .associate { it.id to it.toggleDefault }
}

fun initialSelectValues(): Map<String, String> {
    return settingsSections
        .flatMap { it.rows }
        .filter { it.actionType == SettingsActionType.SELECT }
        .associate { row ->
            row.id to (row.selectDefault.ifBlank { row.selectOptions.firstOrNull().orEmpty() })
        }
}

fun buildInitialUiState(): FotonUiState {
    val settings = SettingsUiState(
        sections = settingsSections,
        toggleValues = initialToggleValues(),
        selectValues = initialSelectValues(),
    )

    return FotonUiState(
        camera = CameraUiState(hudValues = buildHudValues(CameraModeId.PHOTO)),
        gallery = GalleryUiState(items = galleryItems),
        settings = settings,
    )
}

fun filterGalleryItems(items: List<GalleryItem>, filter: GalleryFilter): List<GalleryItem> {
    return items.filter { item ->
        when (filter) {
            GalleryFilter.ALL -> true
            GalleryFilter.PHOTOS -> item.type == GalleryItemType.PHOTO
            GalleryFilter.VIDEOS -> item.type == GalleryItemType.VIDEO
            GalleryFilter.FAVORITES -> item.isFeatured
            GalleryFilter.LONG_EXPOSURE -> {
                val shutterValue = item.exif?.shutter.orEmpty()
                val longExposureByExif = Regex("(?:^|\\D)(?:1|2|5|10|15|30)s$", RegexOption.IGNORE_CASE).containsMatchIn(shutterValue)
                longExposureByExif || item.alt.contains("long exposure", ignoreCase = true)
            }
        }
    }
}