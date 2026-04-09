package com.greeffer.foton.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

private val FotonColorScheme = darkColorScheme(
    primary = FotonColors.Primary,
    tertiary = FotonColors.Tertiary,
    error = FotonColors.Error,
    background = FotonColors.Background,
    surface = FotonColors.Surface,
    onPrimary = FotonColors.Text,
    onTertiary = FotonColors.Background,
    onBackground = FotonColors.Text,
    onSurface = FotonColors.Text,
    onSurfaceVariant = FotonColors.TextMuted,
    outline = FotonColors.BorderBright,
    outlineVariant = FotonColors.Border,
)

private val FotonTypography = Typography(
    headlineSmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Black,
        fontSize = 20.sp,
        letterSpacing = (-0.3).sp,
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 18.sp,
        letterSpacing = (-0.2).sp,
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Medium,
        fontSize = 15.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 10.sp,
        letterSpacing = 1.8.sp,
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Monospace,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
    ),
)

@Composable
fun FotonTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = FotonColorScheme,
        typography = FotonTypography,
        content = content,
    )
}