import React, { useEffect, useRef, useState } from 'react';
import { useCameraStore } from '../../../stores/cameraStore';

interface VideoModeProps {
  readonly className?: string;
}

export const VideoMode: React.FC<VideoModeProps> = ({ className = '' }) => {
  const isRecording = useCameraStore((s) => s.isRecording);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsed(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');

  if (!isRecording) return null;

  return (
    <div className={`absolute top-24 right-6 pointer-events-auto ${className}`}>
      <div className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded px-2 py-1 flex flex-col items-end">
        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">REC</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
          <span className="text-xs font-mono text-error">{minutes}:{seconds}</span>
        </div>
      </div>
    </div>
  );
};