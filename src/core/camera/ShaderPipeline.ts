export class ShaderPipeline {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGL2RenderingContext | null = null;

  attach(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl2", {
      preserveDrawingBuffer: true,
      alpha: false,
      antialias: false,
    });
  }

  detach(): void {
    this.canvas = null;
    this.gl = null;
  }

  render(_inputTexture: WebGLTexture | null): void {
    if (!this.gl || !this.canvas) return;
  }

  async capturePhoto(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.canvas) {
        reject(new Error("No canvas attached"));
        return;
      }
      this.canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob returned null"));
        },
        "image/png",
        1.0,
      );
    });
  }
}
