package com.greeffer.foton.ui

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.greeffer.foton.state.FotonViewModel
import com.greeffer.foton.ui.screens.camera.CameraScreen
import com.greeffer.foton.ui.screens.gallery.GalleryScreen
import com.greeffer.foton.ui.screens.settings.SettingsScreen
import com.greeffer.foton.ui.theme.FotonColors

@Composable
fun FotonApp(viewModel: FotonViewModel = viewModel()) {
    val navController = rememberNavController()

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = FotonColors.Background,
    ) {
        NavHost(navController = navController, startDestination = "camera") {
            composable("camera") {
                CameraScreen(
                    viewModel = viewModel,
                    onOpenGallery = { navController.navigate("gallery") },
                    onOpenSettings = { navController.navigate("settings") },
                )
            }

            composable("gallery") {
                GalleryScreen(
                    viewModel = viewModel,
                    onBack = { navController.popBackStack() },
                    onOpenCamera = {
                        navController.navigate("camera") {
                            popUpTo("camera") { inclusive = true }
                        }
                    },
                )
            }

            composable("settings") {
                SettingsScreen(
                    viewModel = viewModel,
                    onBack = { navController.popBackStack() },
                    onOpenCamera = {
                        navController.navigate("camera") {
                            popUpTo("camera") { inclusive = true }
                        }
                    },
                )
            }
        }
    }
}