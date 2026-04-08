import { useState } from "react";
import { ToggleSwitch } from "@/ui/ToggleSwitch";
import type { ModuleSettings } from "@/core/registry/types";

interface ProCameraSettingsProps {
  settings?: ModuleSettings;
}

export function ProCameraSettings({ settings }: ProCameraSettingsProps) {
  const [resolution] = useState(
    settings?.get("resolution") ?? "4K (60 FPS)",
  );
  const [hdr, setHdr] = useState(settings?.get("hdr") ?? true);
  const [grid, setGrid] = useState(settings?.get("grid") ?? true);
  const [rawCapture, setRawCapture] = useState(
    settings?.get("raw") ?? true,
  );

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-4 px-2">
          Capture Quality
        </h2>
        <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-outline-variant">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">high_res</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Resolution</p>
                <p className="text-xs text-on-surface-variant">{resolution}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-zinc-600">chevron_right</span>
          </div>

          <div className="flex items-center justify-between p-4 border-b border-outline-variant">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">hdr_on</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Smart HDR</p>
                <p className="text-xs text-on-surface-variant">Optimize dynamic range automatically</p>
              </div>
            </div>
            <ToggleSwitch checked={hdr} onChange={(v) => { setHdr(v); settings?.set("hdr", v); }} />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">raw_on</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">RAW Capture</p>
                <p className="text-xs text-on-surface-variant">Save uncompressed DNG files</p>
              </div>
            </div>
            <ToggleSwitch checked={rawCapture} onChange={(v) => { setRawCapture(v); settings?.set("raw", v); }} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-4 px-2">
          Composition Tools
        </h2>
        <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-outline-variant">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">grid_4x4</span>
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Grid Lines</p>
                <p className="text-xs text-on-surface-variant">Rule of thirds</p>
              </div>
            </div>
            <ToggleSwitch checked={grid} onChange={(v) => { setGrid(v); settings?.set("grid", v); }} color="tertiary" />
          </div>
        </div>
      </section>
    </div>
  );
}
