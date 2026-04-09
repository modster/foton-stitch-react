import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useCameraStore } from '../../../stores/cameraStore';
import { useGalleryStore } from '../../../stores/galleryStore';
import { useCapture } from '../../../hooks/useCapture';
import type { RefObject } from 'react';

interface ShutterButtonProps {
  readonly videoRef?: RefObject<HTMLVideoElement | null>;
  readonly className?: string;
}

export const ShutterButton: React.FC<ShutterButtonProps> = ({ videoRef, className = '' }) => {
  const activeModeId = useCameraStore((s) => s.activeModeId);
  const isRecording = useCameraStore((s) => s.isRecording);
  const isExposing = useCameraStore((s) => s.isExposing);
  const exposureDurationMs = useCameraStore((s) => s.exposureDurationMs);
  const toggleRecording = useCameraStore((s) => s.toggleRecording);
  const toggleExposing = useCameraStore((s) => s.toggleExposing);
  const stopExposing = useCameraStore((s) => s.stopExposing);
  const setExposureElapsed = useCameraStore((s) => s.setExposureElapsed);
  const addItem = useGalleryStore((s) => s.addItem);
  const { capture, download, startRecording, stopRecording } = useCapture({ videoRef: videoRef ?? { current: null } });
  const flashRef = useRef<HTMLDivElement>(null);
  const [leProgress, setLeProgress] = useState(0);
  const leStartTimeRef = useRef<number | null>(null);
  const leFrameRef = useRef<number | null>(null);

  const handlePhotoCapture = useCallback(() => {
    const dataUrl = capture();
    if (!dataUrl) return;

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const filename = `Foton_${timestamp}.jpg`;

    download(dataUrl, filename);

    addItem({
      id: `capture-${timestamp}`,
      type: 'photo',
      src: dataUrl,
      alt: `Captured photo ${now.toLocaleString()}`,
      span: 'full',
      isFeatured: false,
      exif: { shutter: '1/500', iso: '200', aperture: 'f/1.8', whiteBalance: '5500K', focalLength: '26mm' },
    });

    if (flashRef.current) {
      flashRef.current.style.opacity = '1';
      setTimeout(() => {
        if (flashRef.current) flashRef.current.style.opacity = '0';
      }, 150);
    }
  }, [capture, download, addItem]);

  const handleVideoToggle = useCallback(async () => {
    if (!isRecording) {
      const started = startRecording();
      if (started) toggleRecording();
    } else {
      const videoUrl = await stopRecording();
      toggleRecording();
      if (videoUrl) {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-');
        const thumbnail = capture();
        addItem({
          id: `video-${timestamp}`,
          type: 'video',
          src: thumbnail ?? '',
          alt: `Recorded video ${now.toLocaleString()}`,
          span: 'full',
          videoSrc: videoUrl,
        });
      }
    }
  }, [isRecording, startRecording, stopRecording, toggleRecording, capture, addItem]);

  const handleLongExposureCapture = useCallback(() => {
    const dataUrl = capture();
    if (!dataUrl) return;
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    addItem({
      id: `le-${timestamp}`,
      type: 'photo',
      src: dataUrl,
      alt: `Long exposure ${now.toLocaleString()}`,
      span: 'full',
      exif: { shutter: `${exposureDurationMs}ms`, iso: '100', aperture: 'f/11', whiteBalance: 'Auto', focalLength: '26mm' },
    });
    download(dataUrl, `Foton_LE_${timestamp}.jpg`);
  }, [capture, addItem, download, exposureDurationMs]);

  const handlePress = useCallback(() => {
    if (activeModeId === 'video') {
      handleVideoToggle();
    } else if (activeModeId === 'long-exposure') {
      toggleExposing();
    } else {
      handlePhotoCapture();
    }
  }, [activeModeId, handleVideoToggle, toggleExposing, handlePhotoCapture]);

  useEffect(() => {
    if (isExposing) {
      leStartTimeRef.current = performance.now();
      setLeProgress(0);
      const tick = () => {
        if (!leStartTimeRef.current) return;
        const elapsed = performance.now() - leStartTimeRef.current;
        const pct = Math.min((elapsed / exposureDurationMs) * 100, 100);
        setLeProgress(pct);
        setExposureElapsed(Math.round(elapsed));
        if (pct >= 100) {
          stopExposing();
          handleLongExposureCapture();
          return;
        }
        leFrameRef.current = requestAnimationFrame(tick);
      };
      leFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (leFrameRef.current) cancelAnimationFrame(leFrameRef.current);
      setLeProgress(0);
      leStartTimeRef.current = null;
    }
    return () => {
      if (leFrameRef.current) cancelAnimationFrame(leFrameRef.current);
    };
  }, [isExposing, exposureDurationMs, setExposureElapsed, stopExposing, handleLongExposureCapture]);

  if (activeModeId === 'video') {
    return (
      <>
        <div
          ref={flashRef}
          className="fixed inset-0 pointer-events-none z-[100] transition-opacity duration-150"
          style={{ opacity: 0, background: isRecording ? 'rgba(239,68,68,0.15)' : 'white' }}
        />
        <div className="flex flex-col items-center justify-center scale-125">
          <button
            onClick={handlePress}
            className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-90 transition-all duration-200 ${
              isRecording ? 'bg-error shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-error'
            } border-4 border-black ${className}`}
          >
            {isRecording ? (
              <div className="w-5 h-5 bg-white rounded-sm" />
            ) : (
              <div className="w-5 h-5 bg-white rounded-full" />
            )}
          </button>
        </div>
      </>
    );
  }

  if (activeModeId === 'long-exposure') {
    const circumference = 2 * Math.PI * 24;
    const dashOffset = circumference - (circumference * leProgress) / 100;

    return (
      <div className="flex flex-col items-center justify-center scale-125">
        <button
          onClick={handlePress}
          className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center active:scale-90 transition-all duration-200 relative"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-100" />
          {isExposing && (
            <svg className="absolute inset-0 w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </svg>
          )}
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        ref={flashRef}
        className="fixed inset-0 pointer-events-none z-[100] bg-white transition-opacity duration-150"
        style={{ opacity: 0 }}
      />
      <div className="flex flex-col items-center justify-center text-zinc-100 scale-125">
        <button
          onClick={handlePress}
          className="w-16 h-16 rounded-full border-4 border-zinc-100 flex items-center justify-center active:scale-90 transition-all duration-200"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-100" />
        </button>
      </div>
    </>
  );
};