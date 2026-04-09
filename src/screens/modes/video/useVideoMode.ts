import { useCallback } from 'react';
import { useCameraStore } from '../../../stores/cameraStore';
import { VIDEO_HUD_CHIPS } from '../../../data/mockData';

export function useVideoMode() {
  const store = useCameraStore();

  const activateVideoMode = useCallback(() => {
    store.setActiveMode('video');
    store.setHudValues(VIDEO_HUD_CHIPS);
  }, [store]);

  return {
    activateVideoMode,
    isRecording: store.isRecording,
    toggleRecording: store.toggleRecording,
  };
}