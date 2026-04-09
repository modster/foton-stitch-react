import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/ui/Icon';
import { useCameraStore } from '../../../stores/cameraStore';
import { getModes } from '../../../extensions/registry';
import type { CameraModeId } from '../../../types/camera';

const FLASH_ICONS: Record<string, string> = {
  off: 'flash_off',
  on: 'flash_on',
  auto: 'flash_auto',
};

export const CameraTopBar: React.FC = () => {
  const navigate = useNavigate();
  const showGrid = useCameraStore((s) => s.showGrid);
  const showRaw = useCameraStore((s) => s.showRaw);
  const flashMode = useCameraStore((s) => s.flashMode);
  const showFocusSlider = useCameraStore((s) => s.showFocusSlider);
  const activeModeId = useCameraStore((s) => s.activeModeId);
  const toggleGrid = useCameraStore((s) => s.toggleGrid);
  const toggleRaw = useCameraStore((s) => s.toggleRaw);
  const cycleFlash = useCameraStore((s) => s.cycleFlash);
  const toggleFocusSlider = useCameraStore((s) => s.toggleFocusSlider);
  const setActiveMode = useCameraStore((s) => s.setActiveMode);
  const modes = getModes();

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-14">
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate('/settings')}
          className="text-violet-400 hover:bg-zinc-800 transition-colors active:scale-95 duration-150 p-2 rounded-full"
        >
          <Icon name="settings" size={20} />
        </button>
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id as CameraModeId)}
            className={`transition-colors p-2 rounded-full hover:bg-zinc-800 ${
              mode.id === activeModeId ? 'text-emerald-400' : 'text-violet-400'
            }`}
          >
            <Icon name={mode.icon} size={20} filled={mode.id === activeModeId} />
          </button>
        ))}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
        <h1 className="font-sans tracking-tight text-lg font-black text-zinc-100">Camera</h1>
      </div>
      <div className="flex items-center gap-1">
        {showRaw && (
          <button onClick={toggleRaw} className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 border border-emerald-400/20 rounded">
            RAW
          </button>
        )}
        {!showRaw && (
          <button onClick={toggleRaw} className="text-[10px] font-bold text-zinc-500 hover:text-emerald-400 px-2 py-0.5 border border-zinc-800 rounded transition-colors">
            RAW
          </button>
        )}
        <button
          onClick={cycleFlash}
          className="text-violet-400 hover:bg-zinc-800 transition-colors active:scale-95 duration-150 p-2 rounded-full"
        >
          <Icon name={FLASH_ICONS[flashMode] ?? 'flash_off'} size={20} />
        </button>
        <button
          onClick={toggleGrid}
          className={`transition-colors p-2 rounded-full ${showGrid ? 'text-emerald-400 bg-emerald-400/10' : 'text-violet-400 hover:bg-zinc-800'}`}
        >
          <Icon name="grid_on" size={20} />
        </button>
        <button
          onClick={toggleFocusSlider}
          className={`transition-colors p-2 rounded-full ${showFocusSlider ? 'text-emerald-400 bg-emerald-400/10' : 'text-violet-400 hover:bg-zinc-800'}`}
        >
          <Icon name="straighten" size={20} />
        </button>
      </div>
    </header>
  );
};