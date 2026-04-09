import React, { Suspense, useEffect } from 'react';
import { buildHudValues, useCameraStore } from '../../stores/cameraStore';
import { useSettingsStore } from '../../stores/settingsStore';
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
  const exposureDurationMs = useCameraStore((s) => s.exposureDurationMs);
  const showGrid = useCameraStore((s) => s.showGrid);
  const showFocusSlider = useCameraStore((s) => s.showFocusSlider);
  const setHudValues = useCameraStore((s) => s.setHudValues);
  const videoResolution = useSettingsStore((s) => s.selectValues['video-res'] ?? '4K @ 30fps');
  const stabilizationEnabled = useSettingsStore((s) => s.toggleValues.stabilization ?? true);
  const { videoRef, error, switchCamera, focusSupported, applyFocus } = useWebcam({
    facingMode: 'environment',
    videoResolution,
    stabilizationEnabled,
  });

  const activeMode = getModeById(activeModeId);
  const ModeComponent = activeMode?.component;

  useEffect(() => {
    setHudValues(buildHudValues(activeModeId, { videoResolution, exposureDurationMs }));
  }, [activeModeId, exposureDurationMs, setHudValues, videoResolution]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <CameraTopBar />
      <main className="flex-grow relative pt-14 pb-[10.5rem]">
        <Viewfinder videoRef={videoRef} error={error} />
        <HUDOverlay />
        <ZoomSelector />
        {showFocusSlider && <FocusSlider focusSupported={focusSupported} onFocusChange={applyFocus} />}
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