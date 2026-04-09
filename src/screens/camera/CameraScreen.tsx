import React, { Suspense } from 'react';
import { useCameraStore } from '../../stores/cameraStore';
import { CameraTopBar, BottomNavBar, HUDOverlay, ModeSelector, ZoomSelector, ViewfinderGrid, Viewfinder, FocusSlider } from './components';
import { getModeById } from '../../extensions/registry';
import { useWebcam } from '../../hooks/useWebcam';

interface CameraScreenProps {
  readonly children?: React.ReactNode;
}

const ModeFallback: React.FC = () => (
  <div className="flex items-center justify-center h-full text-on-surface-variant text-sm">
    Loading mode...
  </div>
);

export const CameraScreen: React.FC<CameraScreenProps> = () => {
  const activeModeId = useCameraStore((s) => s.activeModeId);
  const showGrid = useCameraStore((s) => s.showGrid);
  const showFocusSlider = useCameraStore((s) => s.showFocusSlider);
  const { videoRef, error, switchCamera } = useWebcam({ facingMode: 'environment' });

  const activeMode = getModeById(activeModeId);
  const ModeComponent = activeMode?.component;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <CameraTopBar />
      <main className="flex-grow relative pt-14 pb-[10.5rem]">
        <Viewfinder videoRef={videoRef} error={error} />
        <HUDOverlay />
        <ZoomSelector />
        {showFocusSlider && <FocusSlider />}
        {showGrid && <ViewfinderGrid />}
        <Suspense fallback={<ModeFallback />}>
          {ModeComponent && <ModeComponent />}
        </Suspense>
      </main>
      <ModeSelector />
      <BottomNavBar onSwitchCamera={switchCamera} videoRef={videoRef} />
    </div>
  );
};