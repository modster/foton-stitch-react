package com.greeffer.foton.model

enum class CameraModeId(val route: String, val label: String, val iconName: String) {
    PHOTO(route = "camera", label = "PRO", iconName = "photo_camera"),
    VIDEO(route = "camera", label = "VIDEO", iconName = "videocam"),
    LONG_EXPOSURE(route = "camera", label = "LONG EXP", iconName = "motion_photos_on"),
}

enum class LongExposureSubMode(val label: String) {
    GENERIC("GENERIC"),
    STARS("STARS"),
    WATER("WATER"),
}

enum class ShutterVariant {
    PHOTO,
    VIDEO,
    LONG_EXPOSURE,
}

enum class FlashMode {
    OFF,
    ON,
    AUTO,
}

data class HudChip(
    val label: String,
    val value: String,
    val unit: String? = null,
)

data class CameraLensOption(
    val id: String,
    val label: String,
    val focalLength: String,
    val zoomRatio: Float,
)

data class CameraModeSpec(
    val id: CameraModeId,
    val label: String,
    val iconName: String,
    val shutterVariant: ShutterVariant,
    val hudChips: List<HudChip>,
)

data class CameraUiState(
    val activeModeId: CameraModeId = CameraModeId.PHOTO,
    val isRecording: Boolean = false,
    val recordingElapsedMs: Long = 0L,
    val isExposing: Boolean = false,
    val exposureElapsedMs: Long = 0L,
    val exposureDurationMs: Long = 2_000L,
    val hudValues: List<HudChip> = emptyList(),
    val activeLensId: String = "wide",
    val focusValue: Float = 0.5f,
    val focusSupported: Boolean = false,
    val showGrid: Boolean = false,
    val showFocusSlider: Boolean = false,
    val showLevel: Boolean = false,
    val showHistogram: Boolean = false,
    val showOverexposureWarning: Boolean = false,
    val flashMode: FlashMode = FlashMode.AUTO,
    val showRaw: Boolean = false,
    val hasCameraPermission: Boolean = false,
    val previewError: String? = null,
    val longExposureSubMode: LongExposureSubMode = LongExposureSubMode.GENERIC,
)

enum class GalleryItemType {
    PHOTO,
    VIDEO,
}

enum class GallerySpan {
    FULL,
    HALF,
    QUARTER,
}

enum class GalleryFilter(val wireValue: String, val label: String) {
    ALL("all", "All"),
    PHOTOS("photos", "Photos"),
    VIDEOS("videos", "Videos"),
    LONG_EXPOSURE("long exposure", "Long Exposure"),
    FAVORITES("favorites", "Favorites"),
}

data class ExifData(
    val shutter: String,
    val iso: String,
    val aperture: String,
    val whiteBalance: String,
    val focalLength: String,
)

data class GalleryItem(
    val id: String,
    val type: GalleryItemType,
    val src: String,
    val alt: String,
    val span: GallerySpan,
    val exif: ExifData? = null,
    val isFeatured: Boolean = false,
    val videoSrc: String? = null,
)

data class GalleryUiState(
    val items: List<GalleryItem> = emptyList(),
    val selectedItemIds: Set<String> = emptySet(),
    val filterMode: GalleryFilter = GalleryFilter.ALL,
)

enum class SettingsActionType {
    TOGGLE,
    LINK,
    SELECT,
}

data class SettingsRow(
    val id: String,
    val iconName: String,
    val iconAccent: String = "primary",
    val label: String,
    val description: String? = null,
    val actionType: SettingsActionType,
    val toggleDefault: Boolean = false,
    val selectDefault: String = "",
    val selectOptions: List<String> = emptyList(),
)

data class SettingsSection(
    val id: String,
    val title: String,
    val rows: List<SettingsRow>,
)

data class SettingsUiState(
    val sections: List<SettingsSection> = emptyList(),
    val toggleValues: Map<String, Boolean> = emptyMap(),
    val selectValues: Map<String, String> = emptyMap(),
)

data class FotonUiState(
    val camera: CameraUiState,
    val gallery: GalleryUiState,
    val settings: SettingsUiState,
)