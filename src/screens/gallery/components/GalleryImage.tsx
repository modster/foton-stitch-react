import React from 'react';
import type { GalleryItemType } from '../../../types/gallery';

interface GalleryImageProps {
  readonly src: string;
  readonly alt: string;
  readonly type?: GalleryItemType;
  readonly className?: string;
}

export const GalleryImage: React.FC<GalleryImageProps> = ({ src, alt, type = 'photo', className = '' }) => {
  const isDataUrl = src.startsWith('data:');
  return (
    <div className={`aspect-square rounded-xl border border-outline-variant overflow-hidden bg-surface-container group ${className}`}>
      {isDataUrl ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface-variant text-xs group-hover:scale-105 transition-transform duration-500">
          <span className="material-symbols-outlined text-3xl text-zinc-600">image</span>
        </div>
      )}
      {type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl ml-0.5">play_arrow</span>
          </div>
        </div>
      )}
    </div>
  );
};