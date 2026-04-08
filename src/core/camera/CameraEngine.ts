class CameraEngine {
  private stream: MediaStream | null = null;
  private listeners = new Set<(stream: MediaStream | null) => void>();

  async startStream(
    constraints: MediaStreamConstraints = {
      video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    },
  ): Promise<MediaStream> {
    if (this.stream) {
      this.stopStream();
    }

    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.notifyListeners();
    return this.stream;
  }

  stopStream(): void {
    if (!this.stream) return;
    for (const track of this.stream.getTracks()) {
      track.stop();
    }
    this.stream = null;
    this.notifyListeners();
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  onStreamChange(callback: (stream: MediaStream | null) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    for (const cb of this.listeners) {
      cb(this.stream);
    }
  }
}

export const cameraEngine = new CameraEngine();
