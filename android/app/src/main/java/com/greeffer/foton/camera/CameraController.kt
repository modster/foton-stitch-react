package com.greeffer.foton.camera

import android.annotation.SuppressLint
import android.content.Context
import android.os.Environment
import androidx.camera.core.Camera
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.FileOutputOptions
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import androidx.camera.view.PreviewView
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.core.content.ContextCompat
import androidx.core.net.toUri
import androidx.lifecycle.LifecycleOwner
import java.io.File
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

class CameraController(private val context: Context) {
    private var cameraProvider: ProcessCameraProvider? = null
    private var preview: Preview? = null
    private var imageCapture: ImageCapture? = null
    private var videoCapture: VideoCapture<Recorder>? = null
    private var camera: Camera? = null
    private var activeRecording: Recording? = null
    private var boundOwner: LifecycleOwner? = null
    private var boundPreviewView: PreviewView? = null

    var lensFacing by mutableIntStateOf(CameraSelector.LENS_FACING_BACK)
        private set

    var lastError by mutableStateOf<String?>(null)
        private set

    suspend fun bind(
        lifecycleOwner: LifecycleOwner,
        previewView: PreviewView,
        stabilizationEnabled: Boolean,
    ) {
        boundOwner = lifecycleOwner
        boundPreviewView = previewView

        try {
            val provider = cameraProvider ?: getCameraProvider().also { cameraProvider = it }

            val previewUseCase = Preview.Builder().build().also {
                it.surfaceProvider = previewView.surfaceProvider
            }
            val imageCaptureUseCase = ImageCapture.Builder()
                .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                .build()
                .also { it.targetRotation = previewView.display.rotation }
            val recorder = Recorder.Builder()
                .setExecutor(ContextCompat.getMainExecutor(context))
                .setQualitySelector(if (stabilizationEnabled) QualitySelector.from(Quality.FHD) else QualitySelector.from(Quality.HD))
                .build()
            val videoCaptureUseCase = VideoCapture.withOutput(recorder)
            val selector = CameraSelector.Builder().requireLensFacing(lensFacing).build()

            provider.unbindAll()
            camera = provider.bindToLifecycle(lifecycleOwner, selector, previewUseCase, imageCaptureUseCase, videoCaptureUseCase)
            preview = previewUseCase
            imageCapture = imageCaptureUseCase
            videoCapture = videoCaptureUseCase
            lastError = null
        } catch (error: Exception) {
            lastError = error.message ?: "Unable to bind camera preview"
        }
    }

    fun flipCamera() {
        lensFacing = if (lensFacing == CameraSelector.LENS_FACING_BACK) {
            CameraSelector.LENS_FACING_FRONT
        } else {
            CameraSelector.LENS_FACING_BACK
        }
    }

    fun setLinearZoom(value: Float) {
        camera?.cameraControl?.setLinearZoom(value.coerceIn(0f, 1f))
    }

    @SuppressLint("MissingPermission")
    fun takePhoto(
        onSuccess: (String) -> Unit,
        onError: (String) -> Unit,
    ) {
        val capture = imageCapture
        if (capture == null) {
            onError("Photo capture is not ready")
            return
        }

        val outputFile = createMediaFile(extension = "jpg")
        val outputOptions = ImageCapture.OutputFileOptions.Builder(outputFile).build()
        capture.takePicture(
            outputOptions,
            ContextCompat.getMainExecutor(context),
            object : ImageCapture.OnImageSavedCallback {
                override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                    onSuccess(outputFile.toUri().toString())
                }

                override fun onError(exception: ImageCaptureException) {
                    onError(exception.message ?: "Failed to capture photo")
                }
            },
        )
    }

    @SuppressLint("MissingPermission")
    fun startVideo(
        onStart: () -> Unit,
        onFinalize: (String) -> Unit,
        onError: (String) -> Unit,
    ) {
        if (activeRecording != null) {
            return
        }

        val capture = videoCapture
        if (capture == null) {
            onError("Video capture is not ready")
            return
        }

        val outputFile = createMediaFile(extension = "mp4")
        val fileOutputOptions = FileOutputOptions.Builder(outputFile).build()

        activeRecording = capture.output
            .prepareRecording(context, fileOutputOptions)
            .start(ContextCompat.getMainExecutor(context)) { event ->
                when (event) {
                    is VideoRecordEvent.Start -> onStart()
                    is VideoRecordEvent.Finalize -> {
                        activeRecording = null
                        if (event.hasError()) {
                            onError("Failed to finalize recording")
                        } else {
                            onFinalize(outputFile.toUri().toString())
                        }
                    }
                }
            }
    }

    fun stopVideo() {
        activeRecording?.stop()
    }

    fun release() {
        activeRecording?.stop()
        activeRecording = null
        cameraProvider?.unbindAll()
    }

    private suspend fun getCameraProvider(): ProcessCameraProvider {
        return suspendCoroutine { continuation ->
            val future = ProcessCameraProvider.getInstance(context)
            future.addListener(
                {
                    try {
                        continuation.resume(future.get())
                    } catch (error: Exception) {
                        continuation.resumeWithException(error)
                    }
                },
                ContextCompat.getMainExecutor(context),
            )
        }
    }

    private fun createMediaFile(extension: String): File {
        val mediaDir = File(context.getExternalFilesDir(Environment.DIRECTORY_DCIM), "Foton").apply {
            mkdirs()
        }

        return File(mediaDir, "Foton_${System.currentTimeMillis()}.$extension")
    }
}