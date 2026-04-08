import type { FotonModule } from "@/core/registry/types";
import { ProCameraScreen } from "@/modules/pro-camera/ProCameraScreen";
import { ProCameraSettings } from "@/modules/pro-camera/ProCameraSettings";
import { defaultPreset } from "@/modules/pro-camera/presets";

export const proCameraModule: FotonModule = {
  id: "com.foton.pro-camera",
  name: "Pro",
  version: "1.0.0",
  author: "Foton",
  description: "Full manual camera controls with HUD overlays",
  icon: "tune",

  screens: [
    {
      id: "pro",
      label: "Pro",
      component: ProCameraScreen,
    },
  ],

  settings: ProCameraSettings,

  cameraPresets: [defaultPreset],

  onActivate(ctx) {
    ctx.ui.setTopBarItems([
      {
        id: "settings",
        icon: "settings",
        label: "Settings",
        onClick: () => ctx.events.emit("navigate:settings"),
      },
      {
        id: "video",
        icon: "videocam",
        label: "Video",
        onClick: () => ctx.events.emit("navigate:video"),
      },
      {
        id: "long-exposure",
        icon: "motion_photos_on",
        label: "Long Exposure",
        onClick: () => ctx.events.emit("navigate:long-exposure"),
      },
    ]);

    ctx.ui.showHUDChip({
      id: "shutter",
      label: "Shutter",
      value: "1/500",
      position: "left",
    });
    ctx.ui.showHUDChip({
      id: "iso",
      label: "ISO",
      value: "200",
      position: "left",
    });
    ctx.ui.showHUDChip({
      id: "ev",
      label: "EV",
      value: "-0.7",
      accent: true,
      position: "right",
    });
    ctx.ui.showHUDChip({
      id: "wb",
      label: "WB",
      value: "5500K",
      position: "right",
    });

    ctx.requestCameraStream().catch(() => {});
  },

  onDeactivate() {},

  onDestroy() {},
};
