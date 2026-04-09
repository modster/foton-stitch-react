import React from 'react';
import { useCameraStore } from '../../../stores/cameraStore';
import { LENS_OPTIONS } from '../../../data/mockData';
import type { HUDChip } from '../../../types/camera';

interface HUDOverlayProps {
  readonly chips?: ReadonlyArray<HUDChip>;
  readonly className?: string;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({ chips, className = '' }) => {
  const hudValues = useCameraStore((s) => s.hudValues);
  const activeLensId = useCameraStore((s) => s.activeLensId);
  const displayChips = chips ?? hudValues;

  const activeLens = LENS_OPTIONS.find((l) => l.id === activeLensId);
  const leftChips = displayChips.filter((_, i) => i % 2 === 0);
  const rightChips = displayChips.filter((_, i) => i % 2 !== 0);

  return (
    <div className={`absolute top-20 w-full px-6 flex justify-between items-start z-10 pointer-events-none ${className}`}>
      <div className="flex flex-col gap-1 pointer-events-auto">
        {leftChips.map((chip) => (
          <button
            key={chip.label}
            className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded px-2 py-1 flex flex-col text-left hover:bg-zinc-950/80 transition-colors"
          >
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
              {chip.label}
            </span>
            <span className={`text-xs font-mono ${chip.label === 'EV' ? 'text-violet-400' : 'text-zinc-100'}`}>
              {chip.value}{chip.unit ?? ''}
            </span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1 items-end pointer-events-auto">
        {rightChips.map((chip) => (
          <button
            key={chip.label}
            className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded px-2 py-1 flex flex-col items-end hover:bg-zinc-950/80 transition-colors"
          >
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
              {chip.label}
            </span>
            <span className={`text-xs font-mono ${chip.label === 'EV' ? 'text-violet-400' : 'text-zinc-100'}`}>
              {chip.value}{chip.unit ?? ''}
            </span>
          </button>
        ))}
        {activeLens && (
          <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded px-2 py-1 flex flex-col items-end">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">ZOOM</span>
            <span className="text-xs font-mono text-violet-400">{activeLens.label} · {activeLens.focalLength}</span>
          </div>
        )}
      </div>
    </div>
  );
};