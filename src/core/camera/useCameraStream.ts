import { useEffect, useRef, useState, useCallback } from "react";
import { cameraEngine } from "@/core/camera/CameraEngine";

interface UseCameraStreamResult {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  error: string | null;
  startStream: (constraints?: MediaStreamConstraints) => Promise<MediaStream>;
  stopStream: () => void;
}

export function useCameraStream(
  autoStart = true,
  defaultConstraints?: MediaStreamConstraints,
): UseCameraStreamResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startStream = useCallback(
    async (constraints?: MediaStreamConstraints) => {
      setError(null);
      try {
        const newStream = await cameraEngine.startStream(
          constraints ?? defaultConstraints,
        );
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        return newStream;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to access camera";
        setError(message);
        throw err;
      }
    },
    [defaultConstraints],
  );

  const stopStream = useCallback(() => {
    cameraEngine.stopStream();
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (autoStart) {
      startStream().catch(() => {});
    }
    return () => {
      if (stream) {
        cameraEngine.stopStream();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return { stream, videoRef, error, startStream, stopStream };
}
