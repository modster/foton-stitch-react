import { useCallback } from 'react';
import { useCameraStore } from '../../../stores/cameraStore';
import { PHOTO_HUD_CHIPS, VIDEO_HUD_CHIPS } from '../../../data/mockData';
import type { CameraModeId } from '../../../types/camera';

export function useCameraMode() {
  const store = useCameraStore();

  const switchMode = useCallback((modeId: CameraModeId) => {
    store.setActiveMode(modeId);
    if (modeId === 'photo') {
      store.setHudValues(PHOTO_HUD_CHIPS);
    } else if (modeId === 'video') {
      store.setHudValues(VIDEO_HUD_CHIPS);
    }
  }, [store]);

  return {
    activeModeId: store.activeModeId,
    isRecording: store.isRecording,
    isExposing: store.isExposing,
    showGrid: store.showGrid,
    showFocusSlider: store.showFocusSlider,
    switchMode,
    toggleRecording: store.toggleRecording,
    toggleExposing: store.toggleExposing,
    toggleGrid: store.toggleGrid,
    toggleFocusSlider: store.toggleFocusSlider,
  };
}