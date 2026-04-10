package com.greeffer.foton.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.CameraAlt
import androidx.compose.material.icons.outlined.Cameraswitch
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material.icons.outlined.ChevronRight
import androidx.compose.material.icons.outlined.FlashAuto
import androidx.compose.material.icons.outlined.FlashOff
import androidx.compose.material.icons.outlined.FlashOn
import androidx.compose.material.icons.outlined.Folder
import androidx.compose.material.icons.outlined.GridOn
import androidx.compose.material.icons.outlined.Image
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.MotionPhotosOn
import androidx.compose.material.icons.outlined.PhotoLibrary
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material.icons.outlined.Straighten
import androidx.compose.material.icons.outlined.Tune
import androidx.compose.material.icons.outlined.Videocam
import androidx.compose.material.icons.outlined.Warning
import androidx.compose.material.icons.outlined.WaterDrop
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.greeffer.foton.ui.theme.FotonColors

/**
 * @todo the back button should pop the backstack. also, the top bar might overflow on small screens.
 *      DO NOT WRAP, make this element horizontally scrollable instead.
 */
@Composable
fun FotonTopAppBar(
    title: String,
    showBack: Boolean = false,
    onBack: (() -> Unit)? = null,
    leftContent: @Composable RowScope.() -> Unit = {},
    rightContent: @Composable RowScope.() -> Unit = {},
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .statusBarsPadding()
            .height(56.dp)
            .padding(horizontal = 16.dp),
    ) {
        Row(
            modifier = Modifier.align(Alignment.CenterStart),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            if (showBack && onBack != null) {
                GlassIconButton(onClick = onBack, icon = Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "Back")
            }
            leftContent()
        }

//        Text(
//            text = title,
//            style = MaterialTheme.typography.headlineSmall,
//            color = FotonColors.Text,
//            modifier = Modifier.align(Alignment.Center),
//        )

        Row(
            modifier = Modifier.align(Alignment.CenterEnd),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            rightContent()
        }
    }
}

@Composable
fun GlassIconButton(
    onClick: () -> Unit,
    icon: ImageVector,
    contentDescription: String,
    tint: Color = FotonColors.Primary,
    active: Boolean = false,
) {
    Box(
        modifier = Modifier
            .clip(CircleShape)
            .background(if (active) FotonColors.Tertiary.copy(alpha = 0.14f) else Color.Transparent)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick,
            )
            .padding(8.dp),
        contentAlignment = Alignment.Center,
    ) {
        Icon(imageVector = icon, contentDescription = contentDescription, tint = if (active) FotonColors.Tertiary else tint)
    }
}

@Composable
fun FrostedPanel(
    modifier: Modifier = Modifier,
    contentAlignment: Alignment = Alignment.TopStart,
    content: @Composable BoxScope.() -> Unit,
) {
    Surface(
        modifier = modifier,
        color = FotonColors.Overlay,
        shape = RoundedCornerShape(18.dp),
        border = BorderStroke(1.dp, FotonColors.Border),
    ) {
        Box(modifier = Modifier, contentAlignment = contentAlignment, content = content)
    }
}

@Composable
fun MetricChip(
    label: String,
    value: String,
    alignEnd: Boolean = false,
    accent: Boolean = false,
    modifier: Modifier = Modifier,
) {
    FrostedPanel(modifier = modifier) {
        Column(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
            horizontalAlignment = if (alignEnd) Alignment.End else Alignment.Start,
        ) {
            Text(
                text = label,
                color = FotonColors.TextDim,
                style = MaterialTheme.typography.labelMedium,
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = value,
                color = if (accent) FotonColors.Primary else FotonColors.Text,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Medium,
                fontSize = 12.sp,
            )
        }
    }
}

@Composable
fun FilterPill(
    label: String,
    active: Boolean,
    onClick: () -> Unit,
) {
    Surface(
        modifier = Modifier.clickable(onClick = onClick),
        shape = RoundedCornerShape(999.dp),
        color = if (active) FotonColors.Primary else FotonColors.SurfaceLow,
        border = BorderStroke(1.dp, if (active) FotonColors.Primary.copy(alpha = 0.3f) else FotonColors.Border),
    ) {
        Text(
            text = label,
            color = if (active) FotonColors.Background else FotonColors.TextMuted,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp),
            style = MaterialTheme.typography.bodyMedium,
        )
    }
}

@Composable
fun SettingToggle(
    checked: Boolean,
    onCheckedChange: () -> Unit,
) {
    Switch(
        checked = checked,
        onCheckedChange = { onCheckedChange() },
        colors = SwitchDefaults.colors(
            checkedThumbColor = FotonColors.Text,
            checkedTrackColor = FotonColors.Primary,
            uncheckedThumbColor = FotonColors.TextMuted,
            uncheckedTrackColor = FotonColors.SurfaceHigh,
            uncheckedBorderColor = FotonColors.Border,
        ),
    )
}

/**
 * @todo eliminate placeholders in favor of actual data or a "nothing here" message.
 */
@Composable
fun PlaceholderMedia(
    label: String,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier
            .background(
                brush = Brush.linearGradient(
                    listOf(
                        FotonColors.SurfaceHigh,
                        FotonColors.SurfaceLow,
                        FotonColors.Background,
                    ),
                ),
            ),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = label.uppercase(),
            color = FotonColors.TextDim,
            style = MaterialTheme.typography.labelMedium,
            textAlign = TextAlign.Center,
        )
    }
}

fun iconForName(name: String): ImageVector {
    return when (name) {
        "photo_camera" -> Icons.Outlined.CameraAlt
        "videocam" -> Icons.Outlined.Videocam
        "motion_photos_on" -> Icons.Outlined.MotionPhotosOn
        "settings" -> Icons.Outlined.Settings
        "grid_on" -> Icons.Outlined.GridOn
        "straighten" -> Icons.Outlined.Straighten
        "flash_off" -> Icons.Outlined.FlashOff
        "flash_on" -> Icons.Outlined.FlashOn
        "flash_auto" -> Icons.Outlined.FlashAuto
        "cameraswitch" -> Icons.Outlined.Cameraswitch
        "photo_library" -> Icons.Outlined.PhotoLibrary
        "search" -> Icons.Outlined.Search
        "raw" -> Icons.Outlined.Tune
        "image" -> Icons.Outlined.Image
        "stabilization" -> Icons.Outlined.Tune
        "warning" -> Icons.Outlined.Warning
        "folder" -> Icons.Outlined.Folder
        "location_on" -> Icons.Outlined.LocationOn
        "info" -> Icons.Outlined.Info
        "chevron_right" -> Icons.Outlined.ChevronRight
        "check" -> Icons.Outlined.Check
        "star" -> Icons.Outlined.Star
        "water" -> Icons.Outlined.WaterDrop
        "bar_chart" -> Icons.Outlined.BarChart
        else -> Icons.Outlined.Tune
    }
}