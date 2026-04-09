import React, { useEffect, useRef, useState } from 'react';
import { useCameraStore, parseDurationMs } from '../../../stores/cameraStore';
import { LONG_EXPOSURE_DURATION_PRESETS } from '../../../data/mockData';
import { BentoCard } from '../../../components/ui/BentoCard';
import { Toggle } from '../../../components/ui/Toggle';
import { Icon } from '../../../components/ui/Icon';

interface LongExposureModeProps {
  readonly className?: string;
  readonly subMode?: 'generic' | 'stars' | 'water';
}

export const LongExposureMode: React.FC<LongExposureModeProps> = ({
  className = '',
  subMode = 'generic',
}) => {
  const isExposing = useCameraStore((s) => s.isExposing);
  const exposureDurationMs = useCameraStore((s) => s.exposureDurationMs);
  const setExposureDuration = useCameraStore((s) => s.setExposureDuration);
  const [selectedDuration, setSelectedDuration] = useState('2s');

  const handleDurationChange = (preset: string) => {
    setSelectedDuration(preset);
    setExposureDuration(parseDurationMs(preset));
  };

  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
      {isExposing && <ExposureTimer durationMs={exposureDurationMs} />}
      <div className="absolute bottom-48 left-6 right-6 flex flex-col gap-3 pointer-events-auto">
        {subMode === 'stars' && <StarsControls />}
        {subMode === 'water' && <WaterControls selectedDuration={selectedDuration} setSelectedDuration={handleDurationChange} />}
        {subMode === 'generic' && <GenericExposureControls selectedDuration={selectedDuration} setSelectedDuration={handleDurationChange} />}
      </div>
    </div>
  );
};

const ExposureTimer: React.FC<{ readonly durationMs: number }> = ({ durationMs }) => {
  const isExposing = useCameraStore((s) => s.isExposing);
  const stopExposing = useCameraStore((s) => s.stopExposing);
  const setExposureElapsed = useCameraStore((s) => s.setExposureElapsed);
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isExposing) {
      ref.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
      setSeconds(0);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [isExposing]);

  useEffect(() => {
    setExposureElapsed(seconds * 1000);
    if (seconds * 1000 >= durationMs) {
      stopExposing();
    }
  }, [seconds, durationMs, setExposureElapsed, stopExposing]);

  if (!isExposing) return null;

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const totalSecs = Math.round(durationMs / 1000);
  const totalMin = String(Math.floor(totalSecs / 60)).padStart(2, '0');
  const totalSec = String(totalSecs % 60).padStart(2, '0');

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none">
      <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded px-3 py-1 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
        <span className="text-xs font-mono text-error">{minutes}:{secs}</span>
        <span className="text-[9px] text-zinc-500">/</span>
        <span className="text-[9px] font-mono text-zinc-500">{totalMin}:{totalSec}</span>
      </div>
    </div>
  );
};

const GenericExposureControls: React.FC<{
  readonly selectedDuration: string;
  readonly setSelectedDuration: (v: string) => void;
}> = ({ selectedDuration, setSelectedDuration }) => (
  <BentoCard className="p-3">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Duration</span>
    </div>
    <div className="flex items-center gap-2 overflow-x-auto">
      {LONG_EXPOSURE_DURATION_PRESETS.map((preset) => (
        <button
          key={preset}
          onClick={() => setSelectedDuration(preset)}
          className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-colors active:scale-95 ${
            preset === selectedDuration
              ? 'text-violet-400 border-violet-400/50 bg-violet-400/10'
              : 'text-zinc-400 border-zinc-800 hover:text-zinc-100'
          }`}
        >
          {preset}
        </button>
      ))}
    </div>
  </BentoCard>
);

const StarsControls: React.FC = () => {
  const [trackingOn, setTrackingOn] = useState(false);
  return (
  <div className="flex flex-col gap-3">
    <BentoCard className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="star" size={16} className="text-tertiary" />
          <span className="text-xs font-bold text-on-surface">Tracking</span>
        </div>
        <Toggle checked={trackingOn} onChange={() => setTrackingOn(!trackingOn)} />
      </div>
    </BentoCard>
    <BentoCard className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Trail Length</span>
        <span className="text-xs font-mono text-violet-400">30s</span>
      </div>
      <div className="w-full h-1 bg-zinc-800 rounded-full relative">
        <div className="absolute left-0 top-0 h-1 bg-primary rounded-full w-3/4" />
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-zinc-900" style={{ left: '75%' }} />
      </div>
    </BentoCard>
  </div>
  );
};

const WaterControls: React.FC<{
  readonly selectedDuration: string;
  readonly setSelectedDuration: (v: string) => void;
}> = ({ selectedDuration, setSelectedDuration }) => {
  const [smoothingOn, setSmoothingOn] = useState(true);
  return (
  <div className="flex flex-col gap-3">
    <BentoCard className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="water" size={16} className="text-primary" />
          <span className="text-xs font-bold text-on-surface">Smoothing</span>
        </div>
        <Toggle checked={smoothingOn} onChange={() => setSmoothingOn(!smoothingOn)} />
      </div>
    </BentoCard>
    <BentoCard className="p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Duration</span>
        <span className="text-xs font-mono text-violet-400">{selectedDuration}</span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto">
        {LONG_EXPOSURE_DURATION_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => setSelectedDuration(preset)}
            className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-colors active:scale-95 ${
              preset === selectedDuration
                ? 'text-violet-400 border-violet-400/50 bg-violet-400/10'
                : 'text-zinc-400 border-zinc-800 hover:text-zinc-100'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>
    </BentoCard>
  </div>
);
};