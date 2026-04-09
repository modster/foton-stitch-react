import { useRef, useEffect, useCallback, useState } from 'react';
import type { RefObject } from 'react';

interface UseWebcamOptions {
  readonly facingMode?: 'user' | 'environment';
  readonly enabled?: boolean;
}

interface UseWebcamReturn {
  readonly videoRef: React.RefObject<HTMLVideoElement | null>;
  readonly stream: MediaStream | null;
  readonly error: string | null;
  readonly switchCamera: () => void;
  readonly isFrontCamera: boolean;
}

export function useWebcam(options: UseWebcamOptions = {}): UseWebcamReturn {
  const { facingMode: initialFacing = 'environment', enabled = true } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isFront, setIsFront] = useState(initialFacing === 'user');
  const [error, setError] = useState<string | null>(null);
  const [, setVersion] = useState(0);

  const startStream = useCallback(async (facing: 'user' | 'environment') => {
    if (!enabled) return;
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setVersion((v) => v + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Camera access denied');
    }
  }, [enabled]);

  const switchCamera = useCallback(() => {
    setIsFront((prev) => {
      const next = !prev;
      startStream(next ? 'user' : 'environment');
      return next;
    });
  }, [startStream]);

  useEffect(() => {
    if (!enabled) {
      if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
      return;
    }
    startStream(isFront ? 'user' : 'environment');
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop()); };
  }, [enabled, isFront, startStream]);

  return { videoRef, stream: streamRef.current, error, switchCamera, isFrontCamera: isFront };
}

interface CaptureOptions {
  readonly videoRef: RefObject<HTMLVideoElement | null>;
}

export function useCapture({ videoRef }: CaptureOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const capture = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.92);
  }, [videoRef]);

  const download = useCallback((dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const startRecording = useCallback((): boolean => {
    const video = videoRef.current;
    if (!video) return false;
    const stream = video.srcObject as MediaStream | null;
    if (!stream) return false;
    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
          ? 'video/webm;codecs=vp8'
          : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      return true;
    } catch { return false; }
  }, [videoRef]);

  const stopRecording = useCallback((): Promise<string | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return Promise.resolve(null);
    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-');
        const link = document.createElement('a');
        link.href = url;
        link.download = `Foton_${timestamp}.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        mediaRecorderRef.current = null;
        resolve(url);
      };
      recorder.stop();
    });
  }, []);

  return { capture, download, startRecording, stopRecording };
}