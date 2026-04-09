import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../camera/components/TopAppBar';
import { BottomNavBar } from '../camera/components/BottomNavBar';
import { GalleryGrid } from './components/GalleryGrid';
import { Icon } from '../../components/ui/Icon';
import { FilterChip } from '../../components/ui/FilterChip';
import { useGalleryStore } from '../../stores/galleryStore';

interface GalleryScreenProps {
  readonly className?: string;
}

const FILTER_OPTIONS = ['All', 'Photos', 'Videos', 'Long Exposure', 'Favorites'];

export const GalleryScreen: React.FC<GalleryScreenProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const items = useGalleryStore((s) => s.items);
  const filterMode = useGalleryStore((s) => s.filterMode);
  const setFilterMode = useGalleryStore((s) => s.setFilterMode);
  const filteredItems = items.filter((item) => {
    if (filterMode === 'all') return true;
    if (filterMode === 'photos') return item.type === 'photo';
    if (filterMode === 'videos') return item.type === 'video';
    if (filterMode === 'favorites') return Boolean(item.isFeatured);
    if (filterMode === 'long exposure') {
      const shutterValue = item.exif?.shutter ?? '';
      return /(?:^|\D)(?:1|2|5|10|15|30)s$/i.test(shutterValue) || item.alt.toLowerCase().includes('long exposure');
    }
    return true;
  });

  return (
    <div className={`h-screen w-screen bg-background flex flex-col ${className}`}>
      <TopAppBar
        title="Gallery"
        showBack
        onBack={() => navigate('/')}
        rightContent={
          <button className="text-violet-400 hover:bg-zinc-800 transition-colors active:scale-95 duration-150 p-2 rounded-full">
            <Icon name="search" size={20} />
          </button>
        }
      />
      <div className="flex-grow overflow-y-auto pt-14 pb-28 px-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {FILTER_OPTIONS.map((filter) => (
            <FilterChip
              key={filter}
              label={filter}
              active={filter.toLowerCase() === filterMode}
              onClick={() => setFilterMode(filter.toLowerCase())}
            />
          ))}
        </div>
        <GalleryGrid items={filteredItems} />
      </div>
      <BottomNavBar showShutter={false} />
    </div>
  );
};