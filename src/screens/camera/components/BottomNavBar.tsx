import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/ui/Icon';
import { ShutterButton } from './ShutterButton';
import { useGalleryStore } from '../../../stores/galleryStore';
import type { RefObject } from 'react';

const noop = () => { /* no-op */ };

interface BottomNavBarProps {
  readonly showShutter?: boolean;
  readonly onSwitchCamera?: () => void;
  readonly videoRef?: RefObject<HTMLVideoElement | null>;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ showShutter = true, onSwitchCamera, videoRef }) => {
  const navigate = useNavigate();
  const handleSwitch = onSwitchCamera ?? noop;
  const lastPhoto = useGalleryStore((s) => s.items[0]);

  const hasThumbnail = lastPhoto && lastPhoto.src.startsWith('data:');

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-6 pb-6 pt-3 h-24">
      <div
        className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 transition-all duration-200 cursor-pointer"
        onClick={() => navigate('/gallery')}
      >
        <div className="w-12 h-12 rounded-lg border-2 border-zinc-800 overflow-hidden active:scale-90 transition-transform">
          {hasThumbnail ? (
            <img src={lastPhoto.src} alt={lastPhoto.alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-surface-container/80 backdrop-blur-sm flex items-center justify-center">
              <Icon name="photo_library" size={20} className="text-zinc-500" />
            </div>
          )}
        </div>
        <span className="text-[9px] mt-1 text-zinc-500">Gallery</span>
      </div>
      {showShutter && <ShutterButton videoRef={videoRef} />}
      <div
        className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 transition-all duration-200 cursor-pointer"
        onClick={handleSwitch}
      >
        <div className="w-12 h-12 rounded-full bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center border border-zinc-800 active:scale-90 transition-transform">
          <Icon name="cameraswitch" size={24} className="text-zinc-100" />
        </div>
        <span className="text-[9px] mt-1 text-zinc-500">Flip</span>
      </div>
    </footer>
  );
};