import { useCallback } from 'react';
import { useCameraStore } from '../../../stores/cameraStore';

export function useLongExposure() {
  const store = useCameraStore();

  const activateLongExposure = useCallback(() => {
    store.setActiveMode('long-exposure');
  }, [store]);

  return {
    activateLongExposure,
    isExposing: store.isExposing,
    exposureElapsed: store.exposureElapsed,
    toggleExposing: store.toggleExposing,
  };
}