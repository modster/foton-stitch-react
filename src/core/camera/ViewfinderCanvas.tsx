import { useRef, useEffect } from "react";
import { useCameraStream } from "@/core/camera/useCameraStream";

interface ViewfinderCanvasProps {
  className?: string;
  onCaptureReady?: (captureFn: () => Promise<Blob>) => void;
}

export function ViewfinderCanvas({
  className = "",
  onCaptureReady,
}: ViewfinderCanvasProps) {
  const { videoRef, error } = useCameraStream(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!video || !canvas || !ctx) return;
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
      }
      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [videoRef]);

  useEffect(() => {
    if (!onCaptureReady || !canvasRef.current) return;

    const capture = async (): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const canvas = canvasRef.current;
        if (!canvas) {
          reject(new Error("No canvas"));
          return;
        }
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Capture failed"));
          },
          "image/png",
          1.0,
        );
      });
    };

    onCaptureReady(capture);
  }, [onCaptureReady]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <div className="text-center px-6">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">
              videocam_off
            </span>
            <p className="text-sm text-on-surface-variant">{error}</p>
            <p className="text-xs text-on-surface-variant/60 mt-1">
              Grant camera permission to continue
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
