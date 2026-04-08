import type { CameraPreset } from "@/core/registry/types";

export const defaultPreset: CameraPreset = {
  iso: 200,
  shutter: "1/500",
  ev: -0.7,
  wb: 5500,
};

export const presets: CameraPreset[] = [
  defaultPreset,
  { iso: 100, shutter: "1/1000", ev: 0, wb: 6500 },
  { iso: 800, shutter: "1/60", ev: 0.3, wb: 3200 },
  { iso: 3200, shutter: "1/30", ev: -1.0, wb: 4000 },
];
