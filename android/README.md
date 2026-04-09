# Foton Android Compose Port

This directory contains a standalone Android Jetpack Compose application derived from the React camera prototype in the repository root.

## What is included

- Compose Navigation app shell for Camera, Gallery, and Settings
- Material 3 dark theme aligned to the existing obsidian design language
- Shared Kotlin models and mock data mirroring the TypeScript app state
- A ViewModel-based state layer replacing the original Zustand stores
- CameraX preview, photo capture, and video recording entry points

## What still needs native follow-up

- CameraX is wired for preview, photo capture, and file-backed video recording, but the advanced web-only behaviors do not have full Android equivalents yet:
    - manual focus distance control
    - long-exposure image stacking / blur compositing
    - gallery thumbnails for recorded video files
    - saving into MediaStore instead of the app-specific DCIM directory
- The project intentionally keeps the original React app intact for reference instead of deleting it.

## Running it

Open the `android/` directory in Android Studio and let it generate the Gradle wrapper if needed. Then run the `app` configuration on an emulator or device with camera access.
