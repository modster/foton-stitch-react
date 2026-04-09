import { useCallback } from 'react';
import { useCameraStore } from '../../../stores/cameraStore';
import { PHOTO_HUD_CHIPS } from '../../../data/mockData';

export function usePhotoMode() {
  const store = useCameraStore();

  const activatePhotoMode = useCallback(() => {
    store.setActiveMode('photo');
    store.setHudValues(PHOTO_HUD_CHIPS);
  }, [store]);

  return {
    activatePhotoMode,
    showGrid: store.showGrid,
    toggleGrid: store.toggleGrid,
  };
}