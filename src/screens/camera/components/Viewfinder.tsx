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
  const scale = ZOOM_LEVELS[activeLensId] ?? 1;

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: `scale(${scale})` }}
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
      {scale > 1 && (
        <div className="absolute inset-0 pointer-events-none border-[3px] border-white/20 rounded-xl z-10" />
      )}
    </div>
  );
};