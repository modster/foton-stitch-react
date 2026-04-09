import React from 'react';
import type { EXIFData } from '../../../types/gallery';

interface EXIFDataOverlayProps {
  readonly exif: EXIFData;
  readonly className?: string;
}

export const EXIFDataOverlay: React.FC<EXIFDataOverlayProps> = ({ exif, className = '' }) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-md rounded-b-xl border-t border-zinc-800 px-3 py-2 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-tertiary">{exif.shutter}</span>
        <div className="w-px h-4 bg-zinc-800" />
        <span className="text-xs font-mono text-tertiary">ISO {exif.iso}</span>
        <div className="w-px h-4 bg-zinc-800" />
        <span className="text-xs font-mono text-tertiary">{exif.aperture}</span>
      </div>
    </div>
  );
};