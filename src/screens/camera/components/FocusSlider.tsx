import React from 'react';
import { useCameraStore } from '../../../stores/cameraStore';

interface FocusSliderProps {
  readonly focusSupported?: boolean;
  readonly onFocusChange?: (value: number) => void | Promise<void>;
  readonly className?: string;
}

export const FocusSlider: React.FC<FocusSliderProps> = ({ focusSupported = false, onFocusChange, className = '' }) => {
  const showFocusSlider = useCameraStore((s) => s.showFocusSlider);
  const focusValue = useCameraStore((s) => s.focusValue);
  const setFocusValue = useCameraStore((s) => s.setFocusValue);

  if (!showFocusSlider) return null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    setFocusValue(nextValue);
    void onFocusChange?.(nextValue);
  };

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    const nextValue = Number(event.currentTarget.value);
    setFocusValue(nextValue);
    void onFocusChange?.(nextValue);
  };

  return (
    <div className={`absolute right-6 top-1/2 -translate-y-1/2 h-56 w-16 flex flex-col items-center justify-center py-4 z-10 pointer-events-auto ${className}`}>
      <div className="rounded-full border border-zinc-800 bg-zinc-950/60 backdrop-blur-md px-3 py-4 flex flex-col items-center gap-3">
        <span className="text-[8px] font-black text-zinc-500 tracking-widest uppercase">Near</span>
        <div className="relative h-36 flex items-center justify-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={focusValue}
            onChange={handleChange}
            onInput={handleInput}
            aria-label="Manual focus"
            className="h-36 w-3 cursor-pointer appearance-none bg-transparent [writing-mode:bt-lr]"
            style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
          />
          <div className="pointer-events-none absolute inset-y-1 left-1/2 -translate-x-1/2 w-0.5 bg-zinc-800 rounded-full" />
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-violet-400 ring-4 ring-violet-400/20"
            style={{ top: `calc(${(1 - focusValue) * 100}% - 0.375rem)` }}
          />
        </div>
        <span className="text-[8px] font-black text-zinc-500 tracking-widest uppercase">Far</span>
      </div>
      <span className="text-[8px] font-black text-zinc-500 rotate-90 absolute -right-6 top-1/2 -translate-y-1/2 whitespace-nowrap tracking-widest">
        FOCUS
      </span>
      <span className={`mt-2 text-[8px] font-bold uppercase tracking-widest ${focusSupported ? 'text-emerald-400' : 'text-zinc-500'}`}>
        {focusSupported ? 'Manual' : 'Preview'}
      </span>
    </div>
  );
};