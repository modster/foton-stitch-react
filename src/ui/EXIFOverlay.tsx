interface EXIFOverlayProps {
  iso?: string;
  shutter?: string;
  aperture?: string;
  lens?: string;
}

export function EXIFOverlay({ iso, shutter, aperture, lens }: EXIFOverlayProps) {
  const entries = [
    iso && { label: "ISO", value: iso },
    shutter && { label: "Shutter", value: shutter },
    aperture && { label: "Aperture", value: aperture },
    lens && { label: "Lens", value: lens },
  ].filter(Boolean) as { label: string; value: string }[];

  if (entries.length === 0) return null;

  return (
    <div className="p-4 bg-zinc-950/80 backdrop-blur-md rounded-lg border border-zinc-800 flex flex-col gap-2">
      <div className="flex items-center gap-4">
        {entries.map((entry, i) => (
          <div key={entry.label} className="flex items-center gap-4">
            {i > 0 && <div className="w-px h-6 bg-zinc-800" />}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                {entry.label}
              </span>
              <span className="text-sm font-mono text-tertiary">
                {entry.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
