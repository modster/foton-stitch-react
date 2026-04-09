import React from 'react';
import { useCameraStore } from '../../../stores/cameraStore';

interface ViewfinderProps {
  readonly videoRef: React.RefObject<HTMLVideoElement | null>;
  readonly error?: string | null;
  readonly className?: string;
}

const ZOOM_LEVELS: Record<string, number> = {
  'ultra-wide': 0.5,
  'wide': 1,
  'telephoto': 2,
  'super-tele': 5,
};

export const Viewfinder: React.FC<ViewfinderProps> = ({ videoRef, error, className = '' }) => {
  const activeLensId = useCameraStore((s) => s.activeLensId);
  const focusValue = useCameraStore((s) => s.focusValue);
  const focusSupported = useCameraStore((s) => s.focusSupported);
  const showLevel = useCameraStore((s) => s.showLevel);
  const showHistogram = useCameraStore((s) => s.showHistogram);
  const showOverexposureWarning = useCameraStore((s) => s.showOverexposureWarning);
  const scale = ZOOM_LEVELS[activeLensId] ?? 1;
  const fallbackBlur = focusSupported ? 0 : Math.max(0, (1 - focusValue) * 3);
  const histogramBars = Array.from({ length: 16 }, (_, index) => {
    const phase = (index / 15) * Math.PI;
    return Math.max(18, Math.round((Math.sin(phase) * 0.6 + 0.4) * 56));
  });

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: `scale(${scale})`, filter: fallbackBlur > 0 ? `blur(${fallbackBlur.toFixed(2)}px)` : undefined }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest">
          <div className="text-center px-6">
            <span className="material-symbols-outlined text-5xl text-zinc-600 mb-3 block">videocam_off</span>
            <p className="text-on-surface-variant text-sm">{error}</p>
            <p className="text-zinc-600 text-xs mt-2">Allow camera access in your browser settings</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 pointer-events-none" />
      {showOverexposureWarning && (
        <div
          className="absolute inset-[18%] pointer-events-none opacity-35"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(239,68,68,0.4) 0 8px, transparent 8px 16px)',
            mixBlendMode: 'screen',
          }}
        />
      )}
      {scale > 1 && (
        <div className="absolute inset-0 pointer-events-none border-[3px] border-white/20 rounded-xl z-10" />
      )}
      {showLevel && (
        <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
          <div className="h-px flex-1 bg-emerald-400/70" />
          <div className="mx-2 h-3 w-3 rounded-full border border-emerald-400/70 bg-black/40" />
          <div className="h-px flex-1 bg-emerald-400/70" />
        </div>
      )}
      {showHistogram && (
        <div className="absolute bottom-28 left-6 z-10 w-32 rounded-xl border border-zinc-800 bg-zinc-950/60 p-2 backdrop-blur-md pointer-events-none">
          <div className="mb-2 text-[9px] font-bold uppercase tracking-widest text-zinc-500">Histogram</div>
          <div className="flex h-14 items-end gap-[2px]">
            {histogramBars.map((height, index) => (
              <div key={index} className="flex-1 rounded-t bg-violet-400/80" style={{ height }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};