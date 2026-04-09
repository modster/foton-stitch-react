package com.greeffer.foton.ui.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.greeffer.foton.model.SettingsActionType
import com.greeffer.foton.model.SettingsRow
import com.greeffer.foton.state.FotonViewModel
import com.greeffer.foton.ui.components.FotonTopAppBar
import com.greeffer.foton.ui.components.SettingToggle
import com.greeffer.foton.ui.components.iconForName
import com.greeffer.foton.ui.theme.FotonColors

@Composable
fun SettingsScreen(
    viewModel: FotonViewModel,
    onBack: () -> Unit,
    onOpenCamera: () -> Unit,
) {
    val uiState = viewModel.uiState

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(FotonColors.Background),
    ) {
        FotonTopAppBar(title = "Settings", showBack = true, onBack = onBack)

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp),
        ) {
            uiState.settings.sections.forEach { section ->
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(text = section.title, color = FotonColors.TextMuted, style = MaterialTheme.typography.labelMedium)
                    Surface(
                        color = FotonColors.SurfaceLow,
                        shape = RoundedCornerShape(20.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, FotonColors.Border),
                    ) {
                        Column {
                            section.rows.forEachIndexed { index, row ->
                                SettingsRowCard(
                                    row = row,
                                    currentToggle = uiState.settings.toggleValues[row.id] ?: row.toggleDefault,
                                    currentSelect = uiState.settings.selectValues[row.id] ?: row.selectDefault,
                                    isLast = index == section.rows.lastIndex,
                                    onToggle = { viewModel.toggleSetting(row.id) },
                                    onSelect = { viewModel.cycleSetting(row.id) },
                                )
                            }
                        }
                    }
                }
            }
        }

        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .navigationBarsPadding()
                .padding(horizontal = 16.dp, vertical = 12.dp)
                .clickable(onClick = onOpenCamera),
            color = FotonColors.Overlay,
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, FotonColors.Border),
        ) {
            Box(modifier = Modifier.padding(vertical = 16.dp), contentAlignment = Alignment.Center) {
                Text(text = "Back To Camera", color = FotonColors.Text, style = MaterialTheme.typography.bodyLarge)
            }
        }
    }
}

@Composable
private fun SettingsRowCard(
    row: SettingsRow,
    currentToggle: Boolean,
    currentSelect: String,
    isLast: Boolean,
    onToggle: () -> Unit,
    onSelect: () -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(enabled = row.actionType != SettingsActionType.TOGGLE) {
                if (row.actionType == SettingsActionType.SELECT) {
                    onSelect()
                }
            }
            .padding(horizontal = 16.dp, vertical = 16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .background(FotonColors.Surface, RoundedCornerShape(12.dp))
                    .border(1.dp, FotonColors.Border, RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    imageVector = iconForName(row.iconName),
                    contentDescription = null,
                    tint = if (row.iconAccent == "tertiary") FotonColors.Tertiary else FotonColors.Primary,
                )
            }

            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(text = row.label, color = FotonColors.Text, style = MaterialTheme.typography.bodyLarge)
                if (row.description != null) {
                    Text(text = row.description, color = FotonColors.TextMuted, style = MaterialTheme.typography.bodyMedium)
                }
            }
        }

        when (row.actionType) {
            SettingsActionType.TOGGLE -> SettingToggle(checked = currentToggle, onCheckedChange = onToggle)
            SettingsActionType.SELECT -> Surface(
                modifier = Modifier.clickable(onClick = onSelect),
                color = FotonColors.Background,
                shape = RoundedCornerShape(999.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, FotonColors.Border),
            ) {
                Text(
                    text = currentSelect,
                    color = FotonColors.Primary,
                    style = MaterialTheme.typography.labelSmall,
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 9.dp),
                )
            }

            SettingsActionType.LINK -> Icon(imageVector = iconForName("chevron_right"), contentDescription = null, tint = FotonColors.TextMuted)
        }
    }

    if (!isLast) {
        Spacer(modifier = Modifier.fillMaxWidth().height(1.dp).background(FotonColors.Border))
    }
}