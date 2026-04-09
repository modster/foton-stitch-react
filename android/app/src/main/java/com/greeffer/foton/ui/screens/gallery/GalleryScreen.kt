package com.greeffer.foton.ui.screens.gallery

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.matchParentSize
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.horizontalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.greeffer.foton.data.filterGalleryItems
import com.greeffer.foton.model.GalleryFilter
import com.greeffer.foton.model.GalleryItem
import com.greeffer.foton.model.GalleryItemType
import com.greeffer.foton.model.GallerySpan
import com.greeffer.foton.state.FotonViewModel
import com.greeffer.foton.ui.components.FilterPill
import com.greeffer.foton.ui.components.FotonTopAppBar
import com.greeffer.foton.ui.components.PlaceholderMedia
import com.greeffer.foton.ui.components.iconForName
import com.greeffer.foton.ui.theme.FotonColors

@Composable
fun GalleryScreen(
    viewModel: FotonViewModel,
    onBack: () -> Unit,
    onOpenCamera: () -> Unit,
) {
    val uiState = viewModel.uiState
    val filteredItems = filterGalleryItems(uiState.gallery.items, uiState.gallery.filterMode)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(FotonColors.Background),
    ) {
        FotonTopAppBar(
            title = "Gallery",
            showBack = true,
            onBack = onBack,
            rightContent = {
                Icon(imageVector = iconForName("search"), contentDescription = "Search", tint = FotonColors.Primary)
            },
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            GalleryFilter.values().forEach { filter ->
                FilterPill(
                    label = filter.label,
                    active = filter == uiState.gallery.filterMode,
                    onClick = { viewModel.setFilter(filter) },
                )
            }
        }

        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            items(
                items = filteredItems,
                key = { it.id },
                span = { item ->
                    GridItemSpan(
                        when (item.span) {
                            GallerySpan.FULL -> 4
                            GallerySpan.HALF -> 2
                            GallerySpan.QUARTER -> 1
                        },
                    )
                },
            ) { item ->
                GalleryCard(
                    item = item,
                    selected = uiState.gallery.selectedItemIds.contains(item.id),
                    onSelect = { viewModel.toggleSelectItem(item.id) },
                )
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
private fun GalleryCard(
    item: GalleryItem,
    selected: Boolean,
    onSelect: () -> Unit,
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(1f)
            .clip(RoundedCornerShape(20.dp))
            .background(FotonColors.SurfaceLow)
            .border(if (selected) 2.dp else 1.dp, if (selected) FotonColors.Primary else FotonColors.Border, RoundedCornerShape(20.dp))
            .clickable(onClick = onSelect),
    ) {
        when {
            item.type == GalleryItemType.VIDEO -> VideoPlaceholder(item = item)
            item.src.startsWith("placeholder:") -> PlaceholderMedia(label = item.alt, modifier = Modifier.matchParentSize())
            else -> AsyncImage(
                model = item.src,
                contentDescription = item.alt,
                contentScale = ContentScale.Crop,
                modifier = Modifier.matchParentSize(),
            )
        }

        if (item.exif != null) {
            Surface(
                modifier = Modifier.align(Alignment.BottomStart).padding(8.dp),
                color = FotonColors.Overlay,
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, FotonColors.Border),
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    listOf(item.exif.shutter, "ISO ${item.exif.iso}", item.exif.aperture).forEachIndexed { index, text ->
                        Text(text = text, color = FotonColors.Tertiary, style = MaterialTheme.typography.labelSmall)
                        if (index < 2) {
                            Box(modifier = Modifier.width(1.dp).height(16.dp).background(FotonColors.Border))
                        }
                    }
                }
            }
        }

        if (selected) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(10.dp)
                    .size(24.dp)
                    .background(FotonColors.Primary, CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                Icon(imageVector = iconForName("check"), contentDescription = null, tint = FotonColors.Background, modifier = Modifier.size(14.dp))
            }
        }
    }
}

@Composable
private fun VideoPlaceholder(item: GalleryItem) {
    Box(
        modifier = Modifier
            .matchParentSize()
            .background(
                Brush.linearGradient(
                    listOf(
                        FotonColors.SurfaceHigh,
                        FotonColors.SurfaceLow,
                        FotonColors.Background,
                    ),
                ),
            ),
    ) {
        Text(
            text = item.alt,
            color = FotonColors.TextDim,
            style = MaterialTheme.typography.labelMedium,
            modifier = Modifier.align(Alignment.TopStart).padding(12.dp),
        )
        Box(
            modifier = Modifier
                .align(Alignment.Center)
                .size(44.dp)
                .background(FotonColors.Background.copy(alpha = 0.72f), CircleShape)
                .border(1.dp, FotonColors.Border, CircleShape),
            contentAlignment = Alignment.Center,
        ) {
            Icon(imageVector = iconForName("videocam"), contentDescription = null, tint = FotonColors.Text)
        }
    }
}