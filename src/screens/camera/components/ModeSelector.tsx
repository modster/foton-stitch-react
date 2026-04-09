import React from 'react';
import { useCameraStore } from '../../../stores/cameraStore';
import { getModes } from '../../../extensions/registry';
import type { CameraModeId } from '../../../types/camera';

interface ModeSelectorProps {
  readonly className?: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ className = '' }) => {
  const activeModeId = useCameraStore((s) => s.activeModeId);
  const setActiveMode = useCameraStore((s) => s.setActiveMode);

  const modes = getModes();

  return (
    <div className={`fixed bottom-24 left-0 right-0 h-16 flex items-center justify-center gap-8 z-40 overflow-x-auto px-10 ${className}`}>
      {modes.map((mode) => {
        const isActive = mode.id === activeModeId;
        return (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id as CameraModeId)}
            className="transition-all"
          >
            {isActive ? (
              <div className="relative flex flex-col items-center group cursor-pointer">
                <span className="font-sans font-medium text-sm text-emerald-400 uppercase tracking-widest">
                  {mode.label}
                </span>
                <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1" />
              </div>
            ) : (
              <span className="font-sans text-zinc-500 text-[10px] uppercase tracking-widest hover:text-zinc-200 transition-all">
                {mode.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};