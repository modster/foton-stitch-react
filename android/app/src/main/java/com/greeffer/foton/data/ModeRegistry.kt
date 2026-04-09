package com.greeffer.foton.data

import com.greeffer.foton.model.CameraModeId
import com.greeffer.foton.model.CameraModeSpec
import com.greeffer.foton.model.ShutterVariant

object ModeRegistry {
    private val modes = linkedMapOf<CameraModeId, CameraModeSpec>()

    init {
        registerDefaults()
    }

    fun getModes(): List<CameraModeSpec> = modes.values.toList()

    fun getMode(modeId: CameraModeId): CameraModeSpec? = modes[modeId]

    private fun registerDefaults() {
        if (modes.isNotEmpty()) {
            return
        }

        listOf(
            CameraModeSpec(
                id = CameraModeId.PHOTO,
                label = "PRO",
                iconName = "photo_camera",
                shutterVariant = ShutterVariant.PHOTO,
                hudChips = photoHudChips,
            ),
            CameraModeSpec(
                id = CameraModeId.VIDEO,
                label = "VIDEO",
                iconName = "videocam",
                shutterVariant = ShutterVariant.VIDEO,
                hudChips = videoHudChips,
            ),
            CameraModeSpec(
                id = CameraModeId.LONG_EXPOSURE,
                label = "LONG EXP",
                iconName = "motion_photos_on",
                shutterVariant = ShutterVariant.LONG_EXPOSURE,
                hudChips = buildHudValues(CameraModeId.LONG_EXPOSURE),
            ),
        ).forEach { mode ->
            modes[mode.id] = mode
        }
    }
}