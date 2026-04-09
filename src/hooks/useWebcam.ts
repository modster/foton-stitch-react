import { useRef, useEffect, useCallback, useState } from 'react';
import type { RefObject } from 'react';
import { useCameraStore } from '../stores/cameraStore';

interface UseWebcamOptions {
  readonly facingMode?: 'user' | 'environment';
  readonly enabled?: boolean;
  readonly videoResolution?: string;
  readonly stabilizationEnabled?: boolean;
}

interface UseWebcamReturn {
  readonly videoRef: RefObject<HTMLVideoElement | null>;
  readonly stream: MediaStream | null;
  readonly error: string | null;
  readonly switchCamera: () => void;
  readonly isFrontCamera: boolean;
  readonly focusSupported: boolean;
  readonly applyFocus: (value: number) => Promise<void>;
}

type FocusCapabilities = MediaTrackCapabilities & {
  focusDistance?: { min?: number; max?: number; step?: number };
  focusMode?: string[];
  stabilizationMode?: string[];
};

type FocusConstraint = MediaTrackConstraintSet & {
  focusMode?: 'manual' | 'single-shot' | 'continuous';
  focusDistance?: number;
  stabilizationMode?: 'off' | 'auto' | 'steady';
};

function getResolutionConstraints(videoResolution: string | undefined): MediaTrackConstraints {
  switch (videoResolution) {
    case '1080p @ 30fps':
      return { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30, max: 30 } };
    case '1080p @ 60fps':
      return { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 60, max: 60 } };
    case '4K @ 30fps':
    default:
      return { width: { ideal: 3840 }, height: { ideal: 2160 }, frameRate: { ideal: 30, max: 30 } };
  }
}

async function applyTrackFocus(track: MediaStreamTrack | undefined, value: number, stabilizationEnabled: boolean): Promise<boolean> {
  if (!track?.applyConstraints) return false;

  const capabilities = (track.getCapabilities?.() ?? {}) as FocusCapabilities;
  const focusDistance = capabilities.focusDistance;
  const focusModes = capabilities.focusMode ?? [];
  const stabilizationModes = capabilities.stabilizationMode ?? [];

  const advanced: FocusConstraint = {};
  let changed = false;

  if (focusDistance && typeof focusDistance.min === 'number' && typeof focusDistance.max === 'number' && focusModes.includes('manual')) {
    const range = focusDistance.max - focusDistance.min;
    advanced.focusMode = 'manual';
    advanced.focusDistance = focusDistance.min + range * value;
    changed = true;
  }

  if (stabilizationModes.length > 0) {
    advanced.stabilizationMode = stabilizationEnabled && stabilizationModes.includes('auto')
      ? 'auto'
      : stabilizationModes.includes('off')
        ? 'off'
        : stabilizationModes[0] as FocusConstraint['stabilizationMode'];
    changed = true;
  }

  if (!changed) return false;

  try {
    await track.applyConstraints({ advanced: [advanced] as MediaTrackConstraintSet[] });
    return Boolean(advanced.focusDistance || advanced.focusMode === 'manual');
  } catch {
    return false;
  }
}

export function useWebcam(options: UseWebcamOptions = {}): UseWebcamReturn {
  const { facingMode: initialFacing = 'environment', enabled = true, videoResolution = '4K @ 30fps', stabilizationEnabled = true } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isFront, setIsFront] = useState(initialFacing === 'user');
  const [error, setError] = useState<string | null>(null);
  const [focusSupported, setFocusSupported] = useState(false);
  const [, setVersion] = useState(0);
  const focusValue = useCameraStore((s) => s.focusValue);
  const setFocusValue = useCameraStore((s) => s.setFocusValue);
  const setStoreFocusSupported = useCameraStore((s) => s.setFocusSupported);

  const applyFocus = useCallback(async (value: number) => {
    setFocusValue(value);
    const track = streamRef.current?.getVideoTracks()[0];
    const supported = await applyTrackFocus(track, value, stabilizationEnabled);
    setFocusSupported(supported);
    setStoreFocusSupported(supported);
  }, [setFocusValue, setStoreFocusSupported, stabilizationEnabled]);

  const startStream = useCallback(async (facing: 'user' | 'environment') => {
    if (!enabled) return;
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, ...getResolutionConstraints(videoResolution) },
        audio: false,
      });
      streamRef.current = stream;
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const supportsManualFocus = await applyTrackFocus(stream.getVideoTracks()[0], focusValue, stabilizationEnabled);
      setFocusSupported(supportsManualFocus);
      setStoreFocusSupported(supportsManualFocus);
      setVersion((v) => v + 1);
    } catch (err) {
      setFocusSupported(false);
      setStoreFocusSupported(false);
      setError(err instanceof Error ? err.message : 'Camera access denied');
    }
  }, [enabled, focusValue, setStoreFocusSupported, stabilizationEnabled, videoResolution]);

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
      setFocusSupported(false);
      setStoreFocusSupported(false);
      return;
    }
    startStream(isFront ? 'user' : 'environment');
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [enabled, isFront, startStream, setStoreFocusSupported]);

  return { videoRef, stream: streamRef.current, error, switchCamera, isFrontCamera: isFront, focusSupported, applyFocus };
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