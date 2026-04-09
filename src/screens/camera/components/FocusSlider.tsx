import React from 'react';
import { useCameraStore } from '../../../stores/cameraStore';

interface FocusSliderProps {
  readonly className?: string;
}

export const FocusSlider: React.FC<FocusSliderProps> = ({ className = '' }) => {
  const showFocusSlider = useCameraStore((s) => s.showFocusSlider);

  if (!showFocusSlider) return null;

  return (
    <div className={`absolute right-6 top-1/2 -translate-y-1/2 h-48 w-12 flex flex-col items-center justify-between py-4 z-10 pointer-events-auto ${className}`}>
      <div className="h-full w-0.5 bg-zinc-800 relative">
        <div className="absolute -left-[3px] top-1/4 w-2 h-2 bg-violet-400 rounded-full ring-4 ring-violet-400/20" />
        <div className="absolute -left-2 top-0 w-1.5 h-[1px] bg-zinc-600" />
        <div className="absolute -left-2 top-1/2 w-1.5 h-[1px] bg-zinc-600" />
        <div className="absolute -left-2 top-full w-1.5 h-[1px] bg-zinc-600" />
      </div>
      <span className="text-[8px] font-black text-zinc-500 rotate-90 absolute -right-4 top-1/2 -translate-y-1/2 whitespace-nowrap tracking-widest">
        FOCUS
      </span>
    </div>
  );
};