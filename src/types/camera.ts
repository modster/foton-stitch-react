export interface HUDChip {
  readonly label: string;
  readonly value: string;
  readonly unit?: string;
}

export interface CameraLensOption {
  readonly id: string;
  readonly label: string;
  readonly focalLength: string;
}

export type CameraModeId = 'photo' | 'video' | 'long-exposure';
export type LongExposureSubMode = 'generic' | 'stars' | 'water';
export type ShutterVariant = 'photo' | 'video' | 'long-exposure';
export type FlashMode = 'off' | 'on' | 'auto';

export interface CameraModeExtension {
  readonly id: CameraModeId;
  readonly label: string;
  readonly icon: string;
  readonly component: React.LazyExoticComponent<React.ComponentType<object>>;
  readonly hudChips?: ReadonlyArray<HUDChip>;
  readonly settingsSections?: ReadonlyArray<import('./settings').SettingsSection>;
  readonly shutterVariant: ShutterVariant;
}

export interface CameraState {
  readonly activeModeId: CameraModeId;
  readonly isRecording: boolean;
  readonly isExposing: boolean;
  readonly exposureElapsed: number;
  readonly exposureDurationMs: number;
  readonly hudValues: ReadonlyArray<HUDChip>;
  readonly activeLensId: string;
  readonly focusValue: number;
  readonly focusSupported: boolean;
  readonly showGrid: boolean;
  readonly showFocusSlider: boolean;
  readonly showLevel: boolean;
  readonly showHistogram: boolean;
  readonly showOverexposureWarning: boolean;
  readonly flashMode: FlashMode;
  readonly showRaw: boolean;
}

export interface CameraActions {
  setActiveMode: (id: CameraModeId) => void;
  toggleRecording: () => void;
  toggleExposing: () => void;
  setExposureElapsed: (ms: number) => void;
  setExposureDuration: (ms: number) => void;
  setHudValues: (values: ReadonlyArray<HUDChip>) => void;
  setActiveLens: (id: string) => void;
  setFocusValue: (value: number) => void;
  setFocusSupported: (supported: boolean) => void;
  toggleGrid: () => void;
  toggleFocusSlider: () => void;
  toggleLevel: () => void;
  toggleHistogram: () => void;
  toggleOverexposureWarning: () => void;
  cycleFlash: () => void;
  toggleRaw: () => void;
  stopExposing: () => void;
}