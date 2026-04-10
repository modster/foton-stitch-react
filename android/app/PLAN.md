# Code Review & Modularization Strategy

Currently, CameraScreen.kt (1100+ lines) and FotonViewModel.kt (300+ lines) act as monolithic “God objects" that handle UI layout, camera lifecycles, permissions, sensor logic, gallery management, and project state. To make the app easy to extend, you should separate these concerns into discrete modules and apply Jetpack Compose state-hoisting principles.

Here is a step-by-step modularization plan:
1. Decouple FotonViewModel (Domain vs. UI State)
   FotonViewModel is currently managing too many responsibilities (Camera settings, Sensor data like orientation/pitch, Project setup, Photo gallery, Location). Recommendation:
   Create Repositories/Use Cases: Move Location, Sensor, and File/Project management out of the ViewModel and into dedicated classes (e.g., SensorManager, ProjectRepository, MediaRepository).
   Split ViewModels: Create feature-specific ViewModels instead of one global one. For instance:
   CameraViewModel: Handles camera configuration (flash, grid, timer).
   ProjectViewModel: Handles selecting projects, floors, and rooms.
   GalleryViewModel: Manages captured photos.
2. Componentize CameraScreen.kt (UI Modularization)
   At 1108 lines, CameraScreen is a massive Box containing every possible UI overlay. This makes changing the layout or adding features risky. Recommendation: Break CameraScreen down into discrete, stateless @Composable units that pass events up via callbacks. Example target structure:
   ```kotlin
   @Composable
   fun CameraScreen(viewModel: FotonViewModel) {
   // 1. Hoist State
   val state by viewModel.uiState.collectAsStateWithLifecycle()
   ```
   // 2. Main Layout Shell
   ```kotlin
   Scaffold(
   topBar = { CameraTopBar(state, onEvent = viewModel::handleEvent) },
   bottomBar = { CameraBottomControls(state, onEvent = viewModel::handleEvent) }
   ) { padding ->
   Box(modifier = Modifier.padding(padding)) {
   // 3. Feature-specific overlays
   CameraViewfinder(...)
   if (state.showGrid) GridOverlay()
   SensorAlignmentOverlay(state.pitch, state.roll)
   }
   }
   }
   ```
   Extract TopBar: Move the layout containing Flash, Grid, Timer, and Project Selection into a separate file (e.g., CameraTopControls.kt).
   Extract BottomBar: Move the gallery thumbnail, capture button, and switch lens button into CameraBottomControls.kt.
   Extract Sensor Overlays: Extract the pitch/roll indicators (the green lines and circles) into LevelerOverlay.kt.
3. State Hoisting and Unidirectional Data Flow (UDF)
   Currently, UI components might be too aware of how state is updated or the exact shape of FotonViewModel. Recommendation:
   Instead of passing FotonViewModel down into deeply nested composables, pass only the raw data they need (uiState.isGridVisible) and lambdas for actions (onGridToggle: () -> Unit).
   This makes individual UI components easily testable in @Preview without needing a mocked ViewModel.
4. UI/UX and Material 3 (from Skill set)
   Adaptive Layouts: If this app runs on tablets, CameraScreen currently uses hardcoded Box alignments that might look stretched. Use WindowSizeClass to adapt the controls (e.g., move bottom controls to a side rail on landscape/tablets).
   Touch Targets: Ensure icons in CameraScreen have at least 48.dp minimum touch targets (e.g., using IconButton correctly or adding padding to Modifier.clickable).
   Summary of Immediate Action Items:
   Extract CameraPreviewLayer: A dedicated composable that takes CameraController and handles the AndroidView.
   Extract CameraControlsLayer: A layer for the buttons around the view.
   Extract SensorsLayer: A purely visual layer that reads pitch and roll state.
   Extract ProjectSelectionSheet: The modal bottom sheet logic for selecting floors/rooms.
   By splitting CameraScreen.kt into 5-6 smaller files based on visual layers, you will eliminate the monolithic file and be able to easily plug in new features (like a new sensor overlay or new camera mode) just by adding a new composable layer.