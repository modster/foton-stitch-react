import { ShutterButton } from "@/core/shell/ShutterButton";

interface BottomNavBarProps {
  onGalleryClick?: () => void;
  onCapture?: () => void;
  onSwitchCamera?: () => void;
  galleryThumbnail?: string;
  isRecording?: boolean;
}

export function BottomNavBar({
  onGalleryClick,
  onCapture,
  onSwitchCamera,
  galleryThumbnail,
  isRecording = false,
}: BottomNavBarProps) {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 bg-zinc-950 border-t border-zinc-800 h-32">
      <button
        onClick={onGalleryClick}
        className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 transition-all duration-200"
      >
        <div className="w-12 h-12 rounded-lg border-2 border-zinc-800 overflow-hidden active:scale-90 transition-transform">
          {galleryThumbnail ? (
            <img
              src={galleryThumbnail}
              alt="Gallery preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-zinc-600 text-xl">
                photo_library
              </span>
            </div>
          )}
        </div>
      </button>

      <ShutterButton onCapture={onCapture} isRecording={isRecording} />

      <button
        onClick={onSwitchCamera}
        className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 transition-all duration-200"
      >
        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 active:scale-90 transition-transform duration-200">
          <span className="material-symbols-outlined text-zinc-100 text-2xl">
            cameraswitch
          </span>
        </div>
      </button>
    </footer>
  );
}
