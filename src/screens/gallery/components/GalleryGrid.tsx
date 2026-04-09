import React from 'react';
import type { GalleryItem } from '../../../types/gallery';
import { GalleryImage } from './GalleryImage';
import { EXIFDataOverlay } from './EXIFDataOverlay';
import { useGalleryStore } from '../../../stores/galleryStore';
import { Icon } from '../../../components/ui/Icon';

interface GalleryGridProps {
  readonly items: ReadonlyArray<GalleryItem>;
  readonly className?: string;
}

const spanClassMap: Record<string, string> = {
  full: 'col-span-4',
  half: 'col-span-2',
  quarter: 'col-span-1',
};

export const GalleryGrid: React.FC<GalleryGridProps> = ({ items, className = '' }) => {
  const selectedItemIds = useGalleryStore((s) => s.selectedItemIds);
  const toggleSelectItem = useGalleryStore((s) => s.toggleSelectItem);

  return (
    <div className={`grid grid-cols-4 gap-3 ${className}`}>
      {items.map((item) => {
        const isSelected = selectedItemIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={`group relative cursor-pointer ${spanClassMap[item.span] ?? 'col-span-1'} ${isSelected ? 'ring-2 ring-primary rounded-xl' : ''}`}
            onClick={() => toggleSelectItem(item.id)}
          >
            <GalleryImage src={item.src} alt={item.alt} type={item.type} videoSrc={item.videoSrc} />
            {item.exif && <EXIFDataOverlay exif={item.exif} />}
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Icon name="check" size={14} className="text-on-primary" filled />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};