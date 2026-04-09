package com.greeffer.foton.ui.screens.camera

import android.Manifest
import android.content.pm.PackageManager
import android.os.SystemClock
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.view.PreviewView
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.weight
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.greeffer.foton.camera.CameraController
import com.greeffer.foton.data.ModeRegistry
import com.greeffer.foton.data.buildHudValues
import com.greeffer.foton.data.formatDurationLabel
import com.greeffer.foton.data.lensOptions
import com.greeffer.foton.data.longExposureDurationPresets
import com.greeffer.foton.model.CameraModeId
import com.greeffer.foton.model.FlashMode
import com.greeffer.foton.model.GalleryItem
import com.greeffer.foton.model.LongExposureSubMode
import com.greeffer.foton.state.FotonViewModel
import com.greeffer.foton.ui.components.FilterPill
import com.greeffer.foton.ui.components.FotonTopAppBar
import com.greeffer.foton.ui.components.FrostedPanel
import com.greeffer.foton.ui.components.GlassIconButton
import com.greeffer.foton.ui.components.MetricChip
import com.greeffer.foton.ui.components.PlaceholderMedia
import com.greeffer.foton.ui.components.iconForName
import com.greeffer.foton.ui.theme.FotonColors
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun CameraScreen(
    viewModel: FotonViewModel,
    onOpenGallery: () -> Unit,
    onOpenSettings: () -> Unit,
) {
    val uiState = viewModel.uiState
    val cameraState = uiState.camera
    val settingsState = uiState.settings
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val coroutineScope = rememberCoroutineScope()
    val cameraController = remember { CameraController(context) }
    var previewView by remember { mutableStateOf<PreviewView?>(null) }
    var flashOverlayVisible by remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        viewModel.setCameraPermission(granted)
        if (!granted) {
            viewModel.setPreviewError("Camera permission is required for live preview")
        }
    }

    LaunchedEffect(Unit) {
        val granted = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
        if (granted) {
            viewModel.setCameraPermission(true)
        } else {
            permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    val videoResolution = settingsState.selectValues["video-res"] ?: "4K @ 30fps"
    val stabilizationEnabled = settingsState.toggleValues["stabilization"] ?: true
    val activeLens = lensOptions.firstOrNull { it.id == cameraState.activeLensId }
    val latestGalleryItem = uiState.gallery.items.firstOrNull()

    LaunchedEffect(cameraState.hasCameraPermission, previewView, stabilizationEnabled, cameraController.lensFacing) {
        val activePreview = previewView ?: return@LaunchedEffect
        if (!cameraState.hasCameraPermission) {
            return@LaunchedEffect
        }

        cameraController.bind(
            lifecycleOwner = lifecycleOwner,
            previewView = activePreview,
            stabilizationEnabled = stabilizationEnabled,
        )
        viewModel.setPreviewError(cameraController.lastError)
    }

    LaunchedEffect(cameraState.activeLensId) {
        val zoomRatio = lensOptions.firstOrNull { it.id == cameraState.activeLensId }?.zoomRatio ?: 0.2f
        cameraController.setLinearZoom(zoomRatio)
    }

    LaunchedEffect(cameraState.isRecording) {
        if (!cameraState.isRecording) {
            viewModel.setRecordingElapsed(0L)
            return@LaunchedEffect
        }

        val start = SystemClock.elapsedRealtime()
        while (true) {
            viewModel.setRecordingElapsed(SystemClock.elapsedRealtime() - start)
            delay(1_000L)
        }
    }

    LaunchedEffect(cameraState.isExposing, cameraState.exposureDurationMs) {
        if (!cameraState.isExposing) {
            return@LaunchedEffect
        }

        val start = SystemClock.elapsedRealtime()
        while (true) {
            val elapsed = SystemClock.elapsedRealtime() - start
            viewModel.setExposureElapsed(elapsed)
            if (elapsed >= cameraState.exposureDurationMs) {
                cameraController.takePhoto(
                    onSuccess = { uri ->
                        viewModel.handleCapturedPhoto(uri = uri, longExposure = true)
                        viewModel.stopLongExposure()
                    },
                    onError = { message ->
                        viewModel.stopLongExposure()
                        viewModel.setPreviewError(message)
                    },
                )
                break
            }
            delay(50L)
        }
    }

    DisposableEffect(Unit) {
        onDispose {
            cameraController.release()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(FotonColors.Background),
    ) {
        AndroidView(
            modifier = Modifier.fillMaxSize(),
            factory = { previewContext ->
                PreviewView(previewContext).apply {
                    scaleType = PreviewView.ScaleType.FILL_CENTER
                    implementationMode = PreviewView.ImplementationMode.COMPATIBLE
                    previewView = this
                }
            },
            update = { view ->
                previewView = view
            },
        )

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        listOf(
                            FotonColors.Background.copy(alpha = 0.62f),
                            Color.Transparent,
                            FotonColors.Background.copy(alpha = 0.74f),
                        ),
                    ),
                ),
        )

        if (!cameraState.hasCameraPermission || cameraState.previewError != null) {
            CameraPermissionOverlay(
                message = cameraState.previewError ?: "Grant camera permission to start the Android preview",
                onRetry = { permissionLauncher.launch(Manifest.permission.CAMERA) },
            )
        }

        CameraTopBar(
            activeModeId = cameraState.activeModeId,
            showGrid = cameraState.showGrid,
            showRaw = cameraState.showRaw,
            flashMode = cameraState.flashMode,
            showFocusSlider = cameraState.showFocusSlider,
            onModeSelected = viewModel::setActiveMode,
            onOpenSettings = onOpenSettings,
            onToggleRaw = viewModel::toggleRaw,
            onCycleFlash = viewModel::cycleFlash,
            onToggleGrid = viewModel::toggleGrid,
            onToggleFocusSlider = viewModel::toggleFocusSlider,
        )

        HudOverlay(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .padding(top = 92.dp, start = 24.dp, end = 24.dp),
            chips = cameraState.hudValues.ifEmpty {
                buildHudValues(cameraState.activeModeId, videoResolution, cameraState.exposureDurationMs)
            },
            zoomLabel = activeLens?.let { "${it.label} · ${it.focalLength}" },
        )

        if (cameraState.showGrid) {
            ViewfinderGrid(modifier = Modifier.fillMaxSize())
        }

        if (cameraState.showOverexposureWarning) {
            OverExposureOverlay(modifier = Modifier.fillMaxSize())
        }

        if (cameraState.showLevel) {
            LevelOverlay(modifier = Modifier.align(Alignment.Center))
        }

        if (cameraState.showHistogram) {
            HistogramOverlay(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(start = 24.dp, bottom = 164.dp),
            )
        }

        ModeOverlay(
            modifier = Modifier.fillMaxSize(),
            cameraState = cameraState,
            onPresetSelected = viewModel::setExposureDurationFromPreset,
            onSubModeSelected = viewModel::setLongExposureSubMode,
        )

        ZoomSelector(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 164.dp),
            activeLensId = cameraState.activeLensId,
            onLensSelected = viewModel::setActiveLens,
        )

        if (cameraState.showFocusSlider) {
            FocusSlider(
                modifier = Modifier
                    .align(Alignment.CenterEnd)
                    .padding(end = 24.dp),
                focusValue = cameraState.focusValue,
                focusSupported = cameraState.focusSupported,
                onValueChange = viewModel::setFocusValue,
            )
        }

        ModeSelector(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 94.dp),
            activeModeId = cameraState.activeModeId,
            onModeSelected = viewModel::setActiveMode,
        )

        CameraBottomBar(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(horizontal = 24.dp, vertical = 12.dp),
            latestGalleryItem = latestGalleryItem,
            activeModeId = cameraState.activeModeId,
            isRecording = cameraState.isRecording,
            isExposing = cameraState.isExposing,
            exposureProgress = if (cameraState.exposureDurationMs == 0L) 0f else {
                (cameraState.exposureElapsedMs.toFloat() / cameraState.exposureDurationMs.toFloat()).coerceIn(0f, 1f)
            },
            onOpenGallery = onOpenGallery,
            onFlipCamera = {
                cameraController.flipCamera()
                coroutineScope.launch {
                    previewView?.let {
                        cameraController.bind(
                            lifecycleOwner = lifecycleOwner,
                            previewView = it,
                            stabilizationEnabled = stabilizationEnabled,
                        )
                    }
                }
            },
            onShutter = {
                when (cameraState.activeModeId) {
                    CameraModeId.PHOTO -> {
                        cameraController.takePhoto(
                            onSuccess = { uri ->
                                viewModel.handleCapturedPhoto(uri)
                                flashOverlayVisible = true
                                coroutineScope.launch {
                                    delay(160L)
                                    flashOverlayVisible = false
                                }
                            },
                            onError = viewModel::setPreviewError,
                        )
                    }

                    CameraModeId.VIDEO -> {
                        if (cameraState.isRecording) {
                            cameraController.stopVideo()
                        } else {
                            cameraController.startVideo(
                                onStart = { viewModel.setRecording(true) },
                                onFinalize = viewModel::handleRecordedVideo,
                                onError = {
                                    viewModel.setRecording(false)
                                    viewModel.setPreviewError(it)
                                },
                            )
                        }
                    }

                    CameraModeId.LONG_EXPOSURE -> {
                        if (cameraState.isExposing) {
                            viewModel.stopLongExposure()
                        } else {
                            viewModel.startLongExposure()
                        }
                    }
                }
            },
        )

        AnimatedVisibility(
            visible = flashOverlayVisible,
            modifier = Modifier.fillMaxSize(),
        ) {
            Box(modifier = Modifier.fillMaxSize().background(Color.White.copy(alpha = 0.92f)))
        }
    }
}

@Composable
private fun CameraPermissionOverlay(
    message: String,
    onRetry: () -> Unit,
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(FotonColors.Background.copy(alpha = 0.84f)),
        contentAlignment = Alignment.Center,
    ) {
        FrostedPanel(modifier = Modifier.padding(horizontal = 24.dp)) {
            Column(
                modifier = Modifier.padding(horizontal = 24.dp, vertical = 20.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Text(
                    text = "Camera Preview Offline",
                    color = FotonColors.Text,
                    style = MaterialTheme.typography.titleLarge,
                )
                Text(
                    text = message,
                    color = FotonColors.TextMuted,
                    style = MaterialTheme.typography.bodyMedium,
                    textAlign = TextAlign.Center,
                )
                Surface(
                    modifier = Modifier.clickable(onClick = onRetry),
                    color = FotonColors.Primary,
                    shape = RoundedCornerShape(999.dp),
                ) {
                    Text(
                        text = "Request Permission",
                        color = FotonColors.Background,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.padding(horizontal = 18.dp, vertical = 10.dp),
                    )
                }
            }
        }
    }
}

@Composable
private fun CameraTopBar(
    activeModeId: CameraModeId,
    showGrid: Boolean,
    showRaw: Boolean,
    flashMode: FlashMode,
    showFocusSlider: Boolean,
    onModeSelected: (CameraModeId) -> Unit,
    onOpenSettings: () -> Unit,
    onToggleRaw: () -> Unit,
    onCycleFlash: () -> Unit,
    onToggleGrid: () -> Unit,
    onToggleFocusSlider: () -> Unit,
) {
    FotonTopAppBar(
        title = "Camera",
        leftContent = {
            GlassIconButton(onClick = onOpenSettings, icon = iconForName("settings"), contentDescription = "Settings")
            ModeRegistry.getModes().forEach { mode ->
                GlassIconButton(
                    onClick = { onModeSelected(mode.id) },
                    icon = iconForName(mode.iconName),
                    contentDescription = mode.label,
                    active = mode.id == activeModeId,
                )
            }
        },
        rightContent = {
            Surface(
                modifier = Modifier.clickable(onClick = onToggleRaw),
                color = if (showRaw) FotonColors.Tertiary.copy(alpha = 0.14f) else Color.Transparent,
                shape = RoundedCornerShape(6.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, if (showRaw) FotonColors.Tertiary.copy(alpha = 0.35f) else FotonColors.Border),
            ) {
                Text(
                    text = "RAW",
                    color = if (showRaw) FotonColors.Tertiary else FotonColors.TextDim,
                    style = MaterialTheme.typography.labelMedium,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                )
            }
            GlassIconButton(
                onClick = onCycleFlash,
                icon = iconForName(
                    when (flashMode) {
                        FlashMode.OFF -> "flash_off"
                        FlashMode.ON -> "flash_on"
                        FlashMode.AUTO -> "flash_auto"
                    },
                ),
                contentDescription = "Flash",
            )
            GlassIconButton(onClick = onToggleGrid, icon = iconForName("grid_on"), contentDescription = "Grid", active = showGrid)
            GlassIconButton(onClick = onToggleFocusSlider, icon = iconForName("straighten"), contentDescription = "Focus", active = showFocusSlider)
        },
    )
}

@Composable
private fun HudOverlay(
    chips: List<com.greeffer.foton.model.HudChip>,
    zoomLabel: String?,
    modifier: Modifier = Modifier,
) {
    val leftChips = chips.filterIndexed { index, _ -> index % 2 == 0 }
    val rightChips = chips.filterIndexed { index, _ -> index % 2 == 1 }

    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top,
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            leftChips.forEach { chip ->
                MetricChip(label = chip.label, value = chip.value + (chip.unit ?: ""), accent = chip.label == "EV")
            }
        }
        Column(horizontalAlignment = Alignment.End, verticalArrangement = Arrangement.spacedBy(6.dp)) {
            rightChips.forEach { chip ->
                MetricChip(label = chip.label, value = chip.value + (chip.unit ?: ""), alignEnd = true, accent = chip.label == "EV")
            }
            if (zoomLabel != null) {
                MetricChip(label = "ZOOM", value = zoomLabel, alignEnd = true, accent = true)
            }
        }
    }
}

@Composable
private fun ZoomSelector(
    activeLensId: String,
    onLensSelected: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    FrostedPanel(modifier = modifier) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            lensOptions.forEach { lens ->
                Surface(
                    modifier = Modifier.clickable { onLensSelected(lens.id) },
                    shape = RoundedCornerShape(999.dp),
                    color = if (lens.id == activeLensId) FotonColors.SurfaceHigh else Color.Transparent,
                    border = androidx.compose.foundation.BorderStroke(1.dp, if (lens.id == activeLensId) FotonColors.BorderBright else Color.Transparent),
                ) {
                    Text(
                        text = lens.label,
                        color = if (lens.id == activeLensId) FotonColors.Primary else FotonColors.TextMuted,
                        style = MaterialTheme.typography.labelMedium,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    )
                }
            }
        }
    }
}

@Composable
private fun FocusSlider(
    focusValue: Float,
    focusSupported: Boolean,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        FrostedPanel {
            Column(
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 18.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Text(text = "NEAR", color = FotonColors.TextDim, style = MaterialTheme.typography.labelMedium)
                Canvas(
                    modifier = Modifier
                        .width(12.dp)
                        .height(160.dp)
                        .clickable {
                            val next = when {
                                focusValue < 0.33f -> 0.5f
                                focusValue < 0.66f -> 1f
                                else -> 0f
                            }
                            onValueChange(next)
                        },
                ) {
                    val trackX = size.width / 2f
                    drawLine(
                        color = FotonColors.Border,
                        start = Offset(trackX, 0f),
                        end = Offset(trackX, size.height),
                        strokeWidth = 4f,
                        cap = StrokeCap.Round,
                    )
                    val knobY = size.height * (1f - focusValue)
                    drawCircle(
                        color = FotonColors.Primary,
                        radius = 11f,
                        center = Offset(trackX, knobY),
                    )
                    drawCircle(
                        color = FotonColors.Primary.copy(alpha = 0.22f),
                        radius = 22f,
                        center = Offset(trackX, knobY),
                    )
                }
                Text(text = "FAR", color = FotonColors.TextDim, style = MaterialTheme.typography.labelMedium)
            }
        }
        Text(
            text = if (focusSupported) "MANUAL" else "PREVIEW",
            color = if (focusSupported) FotonColors.Tertiary else FotonColors.TextDim,
            style = MaterialTheme.typography.labelMedium,
        )
    }
}

@Composable
private fun ViewfinderGrid(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val thirdWidth = size.width / 3f
        val thirdHeight = size.height / 3f
        repeat(2) { index ->
            val x = thirdWidth * (index + 1)
            val y = thirdHeight * (index + 1)
            drawLine(color = Color.White.copy(alpha = 0.2f), start = Offset(x, 0f), end = Offset(x, size.height), strokeWidth = 1f)
            drawLine(color = Color.White.copy(alpha = 0.2f), start = Offset(0f, y), end = Offset(size.width, y), strokeWidth = 1f)
        }
    }
}

@Composable
private fun OverExposureOverlay(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier.padding(72.dp)) {
        val gap = 18f
        var x = -size.height
        while (x < size.width + size.height) {
            drawLine(
                color = FotonColors.Error.copy(alpha = 0.26f),
                start = Offset(x, 0f),
                end = Offset(x + size.height, size.height),
                strokeWidth = 8f,
            )
            x += gap
        }
    }
}

@Composable
private fun LevelOverlay(modifier: Modifier = Modifier) {
    Row(
        modifier = modifier.width(240.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(modifier = Modifier.weight(1f).height(1.dp).background(FotonColors.Tertiary.copy(alpha = 0.72f)))
        Box(
            modifier = Modifier
                .padding(horizontal = 10.dp)
                .size(12.dp)
                .border(1.dp, FotonColors.Tertiary.copy(alpha = 0.72f), CircleShape),
        )
        Box(modifier = Modifier.weight(1f).height(1.dp).background(FotonColors.Tertiary.copy(alpha = 0.72f)))
    }
}

@Composable
private fun HistogramOverlay(modifier: Modifier = Modifier) {
    val heights = listOf(18, 24, 32, 40, 48, 52, 56, 48, 40, 36, 42, 52, 58, 50, 38, 26)
    FrostedPanel(modifier = modifier) {
        Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp)) {
            Text(text = "HISTOGRAM", color = FotonColors.TextDim, style = MaterialTheme.typography.labelMedium)
            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(2.dp), verticalAlignment = Alignment.Bottom) {
                heights.forEach { height ->
                    Box(
                        modifier = Modifier
                            .width(6.dp)
                            .height(height.dp)
                            .clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp))
                            .background(FotonColors.Primary.copy(alpha = 0.84f)),
                    )
                }
            }
        }
    }
}

@Composable
private fun ModeOverlay(
    cameraState: com.greeffer.foton.model.CameraUiState,
    onPresetSelected: (String) -> Unit,
    onSubModeSelected: (LongExposureSubMode) -> Unit,
    modifier: Modifier = Modifier,
) {
    Box(modifier = modifier) {
        when (cameraState.activeModeId) {
            CameraModeId.PHOTO -> PhotoModeDecoration(modifier = Modifier.align(Alignment.TopStart).padding(top = 112.dp, start = 24.dp))
            CameraModeId.VIDEO -> VideoModeDecoration(
                modifier = Modifier.align(Alignment.TopEnd).padding(top = 112.dp, end = 24.dp),
                recordingElapsedMs = cameraState.recordingElapsedMs,
                active = cameraState.isRecording,
            )
            CameraModeId.LONG_EXPOSURE -> LongExposureModeDecoration(
                modifier = Modifier.align(Alignment.BottomCenter).padding(bottom = 214.dp),
                cameraState = cameraState,
                onPresetSelected = onPresetSelected,
                onSubModeSelected = onSubModeSelected,
            )
        }
    }
}

@Composable
private fun PhotoModeDecoration(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier.size(width = 60.dp, height = 30.dp)) {
        val points = listOf(
            Offset(0f, size.height),
            Offset(size.width * 0.08f, size.height * 0.82f),
            Offset(size.width * 0.16f, size.height * 0.92f),
            Offset(size.width * 0.24f, size.height * 0.5f),
            Offset(size.width * 0.33f, size.height * 0.68f),
            Offset(size.width * 0.42f, size.height * 0.18f),
            Offset(size.width * 0.5f, size.height * 0.58f),
            Offset(size.width * 0.58f, size.height * 0.74f),
            Offset(size.width * 0.66f, size.height * 0.36f),
            Offset(size.width * 0.74f, size.height * 0.52f),
            Offset(size.width * 0.82f, size.height * 0.84f),
            Offset(size.width * 0.92f, size.height * 0.72f),
            Offset(size.width, size.height),
        )
        for (index in 0 until points.lastIndex) {
            drawLine(
                color = Color.White.copy(alpha = 0.42f),
                start = points[index],
                end = points[index + 1],
                strokeWidth = 3f,
                cap = StrokeCap.Round,
            )
        }
    }
}

@Composable
private fun VideoModeDecoration(
    recordingElapsedMs: Long,
    active: Boolean,
    modifier: Modifier = Modifier,
) {
    if (!active) {
        return
    }

    val totalSeconds = recordingElapsedMs / 1_000L
    val minutes = String(totalSeconds / 60).padStart(2, '0')
    val seconds = String(totalSeconds % 60).padStart(2, '0')

    MetricChip(
        modifier = modifier,
        label = "REC",
        value = "$minutes:$seconds",
        alignEnd = true,
        accent = true,
    )
}

@Composable
private fun LongExposureModeDecoration(
    cameraState: com.greeffer.foton.model.CameraUiState,
    onPresetSelected: (String) -> Unit,
    onSubModeSelected: (LongExposureSubMode) -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier.fillMaxWidth().padding(horizontal = 24.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        if (cameraState.isExposing) {
            MetricChip(
                label = "EXPOSING",
                value = "${formatDurationLabel(cameraState.exposureElapsedMs)} / ${formatDurationLabel(cameraState.exposureDurationMs)}",
                accent = true,
            )
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            LongExposureSubMode.values().forEach { mode ->
                FilterPill(label = mode.label, active = mode == cameraState.longExposureSubMode) {
                    onSubModeSelected(mode)
                }
            }
        }

        FrostedPanel(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(text = "DURATION", color = FotonColors.TextMuted, style = MaterialTheme.typography.labelMedium)
                Row(
                    modifier = Modifier.horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    longExposureDurationPresets.forEach { preset ->
                        val isActive = preset == formatDurationLabel(cameraState.exposureDurationMs) || (preset == "2s" && cameraState.exposureDurationMs == 2_000L)
                        FilterPill(label = preset, active = isActive) { onPresetSelected(preset) }
                    }
                }
                when (cameraState.longExposureSubMode) {
                    LongExposureSubMode.GENERIC -> Text(text = "Standard long-exposure timing for light trails and static scenes.", color = FotonColors.TextMuted, style = MaterialTheme.typography.bodyMedium)
                    LongExposureSubMode.STARS -> Text(text = "Star mode keeps the long-exposure shell and leaves room for future astrophotography controls.", color = FotonColors.TextMuted, style = MaterialTheme.typography.bodyMedium)
                    LongExposureSubMode.WATER -> Text(text = "Water mode preserves the smoothing-oriented UX while the actual blend logic still needs a native processing pipeline.", color = FotonColors.TextMuted, style = MaterialTheme.typography.bodyMedium)
                }
            }
        }
    }
}

@Composable
private fun ModeSelector(
    activeModeId: CameraModeId,
    onModeSelected: (CameraModeId) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier.horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(28.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        ModeRegistry.getModes().forEach { mode ->
            val isActive = mode.id == activeModeId
            Column(
                modifier = Modifier.clickable { onModeSelected(mode.id) },
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(
                    text = mode.label,
                    color = if (isActive) FotonColors.Tertiary else FotonColors.TextDim,
                    style = if (isActive) MaterialTheme.typography.bodyLarge else MaterialTheme.typography.labelMedium,
                )
                if (isActive) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Box(modifier = Modifier.size(4.dp).background(FotonColors.Tertiary, CircleShape))
                }
            }
        }
    }
}

@Composable
private fun CameraBottomBar(
    latestGalleryItem: GalleryItem?,
    activeModeId: CameraModeId,
    isRecording: Boolean,
    isExposing: Boolean,
    exposureProgress: Float,
    onOpenGallery: () -> Unit,
    onFlipCamera: () -> Unit,
    onShutter: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            GalleryThumb(item = latestGalleryItem, onClick = onOpenGallery)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = "Gallery", color = FotonColors.TextDim, style = MaterialTheme.typography.labelMedium)
        }
        ShutterButton(
            activeModeId = activeModeId,
            isRecording = isRecording,
            isExposing = isExposing,
            exposureProgress = exposureProgress,
            onClick = onShutter,
        )
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Surface(
                modifier = Modifier.clickable(onClick = onFlipCamera),
                color = FotonColors.Overlay,
                border = androidx.compose.foundation.BorderStroke(1.dp, FotonColors.Border),
                shape = CircleShape,
            ) {
                Box(modifier = Modifier.padding(12.dp), contentAlignment = Alignment.Center) {
                    androidx.compose.material3.Icon(
                        imageVector = iconForName("cameraswitch"),
                        contentDescription = "Flip camera",
                        tint = FotonColors.Text,
                    )
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = "Flip", color = FotonColors.TextDim, style = MaterialTheme.typography.labelMedium)
        }
    }
}

@Composable
private fun GalleryThumb(
    item: GalleryItem?,
    onClick: () -> Unit,
) {
    Surface(
        modifier = Modifier.clickable(onClick = onClick),
        color = FotonColors.Overlay,
        border = androidx.compose.foundation.BorderStroke(2.dp, FotonColors.Border),
        shape = RoundedCornerShape(14.dp),
    ) {
        Box(modifier = Modifier.size(48.dp), contentAlignment = Alignment.Center) {
            if (item == null || item.src.startsWith("placeholder:")) {
                PlaceholderMedia(label = "Gallery", modifier = Modifier.fillMaxSize())
            } else {
                PlaceholderMedia(label = "Shot", modifier = Modifier.fillMaxSize())
            }
        }
    }
}

@Composable
private fun ShutterButton(
    activeModeId: CameraModeId,
    isRecording: Boolean,
    isExposing: Boolean,
    exposureProgress: Float,
    onClick: () -> Unit,
) {
    Box(contentAlignment = Alignment.Center) {
        if (activeModeId == CameraModeId.LONG_EXPOSURE && isExposing) {
            Canvas(modifier = Modifier.size(74.dp)) {
                drawArc(
                    color = FotonColors.Error,
                    startAngle = -90f,
                    sweepAngle = 360f * exposureProgress,
                    useCenter = false,
                    style = Stroke(width = 8f, cap = StrokeCap.Round),
                )
            }
        }

        Surface(
            modifier = Modifier.clickable(onClick = onClick),
            shape = CircleShape,
            color = when (activeModeId) {
                CameraModeId.PHOTO -> Color.Transparent
                CameraModeId.VIDEO -> FotonColors.Error
                CameraModeId.LONG_EXPOSURE -> FotonColors.Text
            },
            border = if (activeModeId == CameraModeId.PHOTO) androidx.compose.foundation.BorderStroke(4.dp, FotonColors.Text) else null,
        ) {
            Box(
                modifier = Modifier.size(if (activeModeId == CameraModeId.PHOTO) 72.dp else 64.dp),
                contentAlignment = Alignment.Center,
            ) {
                when (activeModeId) {
                    CameraModeId.PHOTO -> Box(modifier = Modifier.size(52.dp).background(FotonColors.Text, CircleShape))
                    CameraModeId.VIDEO -> Box(
                        modifier = Modifier
                            .size(22.dp)
                            .background(FotonColors.Text, if (isRecording) RoundedCornerShape(4.dp) else CircleShape),
                    )
                    CameraModeId.LONG_EXPOSURE -> Box(modifier = Modifier.size(44.dp).background(FotonColors.Text, CircleShape))
                }
            }
        }
    }
}