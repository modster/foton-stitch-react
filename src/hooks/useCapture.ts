import { useCallback, useRef } from 'react';
import type { RefObject } from 'react';

interface CaptureOptions {
  readonly videoRef: RefObject<HTMLVideoElement | null>;
}

interface RecordedMedia {
  readonly blob: Blob;
  readonly url: string;
  readonly extension: string;
}

export function useCapture({ videoRef }: CaptureOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const capture = useCallback((quality = 0.92): string | null => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  }, [videoRef]);

  const download = useCallback((dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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

  const stopRecording = useCallback((): Promise<RecordedMedia | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return Promise.resolve(null);
    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        const extension = recorder.mimeType.includes('mp4') ? 'mp4' : 'webm';
        mediaRecorderRef.current = null;
        resolve({ blob, url, extension });
      };
      recorder.stop();
    });
  }, []);

  return { capture, download, downloadBlob, startRecording, stopRecording };
}