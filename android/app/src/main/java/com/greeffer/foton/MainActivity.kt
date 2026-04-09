package com.greeffer.foton

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.greeffer.foton.ui.FotonApp
import com.greeffer.foton.ui.theme.FotonTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            FotonTheme {
                FotonApp()
            }
        }
    }
}