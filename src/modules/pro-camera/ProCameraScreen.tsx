import { useState } from "react";
import { HUDChip } from "@/ui/HUDChip";
import { ZoomSelector } from "@/ui/ZoomSelector";
import { FocusSlider } from "@/ui/FocusSlider";
import type { ModuleContext } from "@/core/registry/types";

interface ProCameraScreenProps {
  context?: ModuleContext;
}

const ZOOM_LEVELS = ["0.6x", "1x", "2.5x"];

export function ProCameraScreen({ context }: ProCameraScreenProps) {
  const [zoomIndex, setZoomIndex] = useState(1);
  const [focus, setFocus] = useState(0.25);
  const iso = context?.settings.get("iso") ?? "200";
  const shutter = context?.settings.get("shutter") ?? "1/500";
  const ev = context?.settings.get("ev") ?? "-0.7";
  const wb = context?.settings.get("wb") ?? "5500K";

  return (
    <>
      <div className="absolute top-20 w-full px-6 flex justify-between items-start z-10 pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          <HUDChip label="Shutter" value={String(shutter)} />
          <HUDChip label="ISO" value={String(iso)} />
        </div>
        <div className="flex flex-col gap-1 items-end pointer-events-auto">
          <HUDChip label="EV" value={String(ev)} accent />
          <HUDChip label="WB" value={String(wb)} />
        </div>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
        <ZoomSelector
          levels={ZOOM_LEVELS}
          activeIndex={zoomIndex}
          onChange={setZoomIndex}
        />
      </div>

      <FocusSlider value={focus} onChange={setFocus} />

      <div className="fixed top-20 left-6 pointer-events-none z-10">
        <svg className="opacity-40" width="60" height="30" viewBox="0 0 60 30">
          <path
            d="M0 30 L5 25 L10 28 L15 15 L20 20 L25 5 L30 18 L35 22 L40 10 L45 15 L50 25 L55 22 L60 30 Z"
            fill="#fafafa"
          />
        </svg>
      </div>
    </>
  );
}
