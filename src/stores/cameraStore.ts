import { create } from 'zustand';
import type { CameraState, CameraActions, CameraModeId, HUDChip } from '../types/camera';
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

export function formatDurationLabel(durationMs: number): string {
  if (durationMs >= 1000) {
    const seconds = durationMs / 1000;
    return Number.isInteger(seconds) ? `${seconds}s` : `${seconds.toFixed(1)}s`;
  }

  return `${durationMs}ms`;
}

export function buildHudValues(modeId: CameraModeId, options: {
  readonly videoResolution?: string;
  readonly exposureDurationMs?: number;
} = {}): ReadonlyArray<HUDChip> {
  if (modeId === 'video') {
    const [resolution = '4K', fpsToken = '30fps'] = (options.videoResolution ?? '4K @ 30fps')
      .split('@')
      .map((part) => part.trim());
    const fps = fpsToken.replace(/fps/i, '').trim() || '30';

    return VIDEO_HUD_CHIPS.map((chip) => {
      if (chip.label === 'RES') {
        return { ...chip, value: resolution };
      }

      if (chip.label === 'FPS') {
        return { ...chip, value: fps };
      }

      return chip;
    });
  }

  if (modeId === 'long-exposure') {
    return [
      { label: 'EXPOSURE', value: formatDurationLabel(options.exposureDurationMs ?? 2000) },
      { label: 'ISO', value: '100' },
      { label: 'EV', value: '+0.0' },
      { label: 'WB', value: 'Auto' },
    ];
  }

  return PHOTO_HUD_CHIPS;
}

export { DURATION_MAP };

export const useCameraStore = create<CameraStore>((set) => ({
  activeModeId: 'photo' as CameraModeId,
  isRecording: false,
  isExposing: false,
  exposureElapsed: 0,
  exposureDurationMs: 2000,
  hudValues: buildHudValues('photo'),
  activeLensId: 'wide',
  focusValue: 0.5,
  focusSupported: false,
  showGrid: false,
  showFocusSlider: false,
  showLevel: false,
  showHistogram: false,
  showOverexposureWarning: false,
  flashMode: 'auto' as 'off' | 'on' | 'auto',
  showRaw: false,

  setActiveMode: (id: CameraModeId) => {
    set({ activeModeId: id, hudValues: buildHudValues(id), isRecording: false, isExposing: false, exposureElapsed: 0 });
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
  setFocusValue: (value: number) =>
    set({ focusValue: Math.max(0, Math.min(1, value)) }),
  setFocusSupported: (supported: boolean) =>
    set({ focusSupported: supported }),
  toggleGrid: () =>
    set((s) => ({ showGrid: !s.showGrid })),
  toggleFocusSlider: () =>
    set((s) => ({ showFocusSlider: !s.showFocusSlider })),
  toggleLevel: () =>
    set((s) => ({ showLevel: !s.showLevel })),
  toggleHistogram: () =>
    set((s) => ({ showHistogram: !s.showHistogram })),
  toggleOverexposureWarning: () =>
    set((s) => ({ showOverexposureWarning: !s.showOverexposureWarning })),
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