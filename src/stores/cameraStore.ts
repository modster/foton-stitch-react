import { create } from 'zustand';
import type { CameraState, CameraActions, CameraModeId } from '../types/camera';
import { PHOTO_HUD_CHIPS, VIDEO_HUD_CHIPS } from '../data/mockData';

type CameraStore = CameraState & CameraActions;

const DURATION_MAP: Record<string, number> = {
  '1s': 1000,
  '2s': 2000,
  '5s': 5000,
  '10s': 10000,
  '15s': 15000,
  '30s': 30000,
};

export function parseDurationMs(preset: string): number {
  return DURATION_MAP[preset] ?? 2000;
}

export { DURATION_MAP };

export const useCameraStore = create<CameraStore>((set) => ({
  activeModeId: 'photo' as CameraModeId,
  isRecording: false,
  isExposing: false,
  exposureElapsed: 0,
  exposureDurationMs: 2000,
  hudValues: PHOTO_HUD_CHIPS,
  activeLensId: 'wide',
  showGrid: false,
  showFocusSlider: false,
  flashMode: 'auto' as 'off' | 'on' | 'auto',
  showRaw: false,

  setActiveMode: (id: CameraModeId) => {
    const hudMap: Record<string, typeof PHOTO_HUD_CHIPS> = {
      photo: PHOTO_HUD_CHIPS,
      video: VIDEO_HUD_CHIPS,
    };
    set({ activeModeId: id, hudValues: hudMap[id] ?? PHOTO_HUD_CHIPS, isRecording: false, isExposing: false, exposureElapsed: 0 });
  },
  toggleRecording: () =>
    set((s) => ({ isRecording: !s.isRecording })),
  toggleExposing: () =>
    set((s) => ({ isExposing: !s.isExposing, exposureElapsed: s.isExposing ? s.exposureElapsed : 0 })),
  setExposureElapsed: (ms: number) =>
    set({ exposureElapsed: ms }),
  setExposureDuration: (ms: number) =>
    set({ exposureDurationMs: ms }),
  setHudValues: (values) =>
    set({ hudValues: values }),
  setActiveLens: (id: string) =>
    set({ activeLensId: id }),
  toggleGrid: () =>
    set((s) => ({ showGrid: !s.showGrid })),
  toggleFocusSlider: () =>
    set((s) => ({ showFocusSlider: !s.showFocusSlider })),
  cycleFlash: () =>
    set((s) => {
      const order: Array<'off' | 'on' | 'auto'> = ['off', 'on', 'auto'];
      const idx = order.indexOf(s.flashMode);
      return { flashMode: order[(idx + 1) % order.length] };
    }),
  toggleRaw: () =>
    set((s) => ({ showRaw: !s.showRaw })),
  stopExposing: () =>
    set({ isExposing: false, exposureElapsed: 0 }),
}));