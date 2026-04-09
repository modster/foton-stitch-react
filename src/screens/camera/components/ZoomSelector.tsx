import React from 'react';
import { useCameraStore } from '../../../stores/cameraStore';
import { LENS_OPTIONS } from '../../../data/mockData';

interface ZoomSelectorProps {
  readonly className?: string;
}

export const ZoomSelector: React.FC<ZoomSelectorProps> = ({ className = '' }) => {
  const activeLensId = useCameraStore((s) => s.activeLensId);
  const setActiveLens = useCameraStore((s) => s.setActiveLens);

  return (
    <div className={`absolute bottom-[10.5rem] left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-950/40 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800/50 z-10 ${className}`}>
      {LENS_OPTIONS.map((lens) => (
        <button
          key={lens.id}
          onClick={() => setActiveLens(lens.id)}
          className={`transition-colors ${
            lens.id === activeLensId
              ? 'text-violet-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-700 text-[11px] font-black'
              : 'text-[10px] font-bold text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {lens.label}
        </button>
      ))}
    </div>
  );
};