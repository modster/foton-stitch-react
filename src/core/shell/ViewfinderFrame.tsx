import type { ReactNode } from "react";
import { ViewfinderCanvas } from "@/core/camera/ViewfinderCanvas";

interface ViewfinderFrameProps {
  children?: ReactNode;
  showGrid?: boolean;
  onCaptureReady?: (captureFn: () => Promise<Blob>) => void;
}

export function ViewfinderFrame({
  children,
  showGrid = true,
  onCaptureReady,
}: ViewfinderFrameProps) {
  return (
    <main className="flex-grow relative flex items-center justify-center pt-14 pb-48">
      <div className="absolute inset-0 z-0">
        <ViewfinderCanvas onCaptureReady={onCaptureReady} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(9,9,11,0.6) 0%, rgba(9,9,11,0) 20%, rgba(9,9,11,0) 80%, rgba(9,9,11,0.6) 100%)",
          }}
        />
      </div>

      {showGrid && (
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
          <div className="border-r border-b border-zinc-100" />
          <div className="border-r border-b border-zinc-100" />
          <div className="border-b border-zinc-100" />
          <div className="border-r border-b border-zinc-100" />
          <div className="border-r border-b border-zinc-100" />
          <div className="border-b border-zinc-100" />
          <div className="border-r border-zinc-100" />
          <div className="border-r border-zinc-100" />
          <div />
        </div>
      )}

      {children}
    </main>
  );
}
