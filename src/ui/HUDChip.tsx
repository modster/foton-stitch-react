interface HUDChipProps {
  label: string;
  value: string;
  accent?: boolean;
  className?: string;
}

export function HUDChip({
  label,
  value,
  accent = false,
  className = "",
}: HUDChipProps) {
  return (
    <div
      className={`bg-zinc-950/60 backdrop-blur-md border border-zinc-800 rounded px-2 py-1 flex flex-col ${className}`}
    >
      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">
        {label}
      </span>
      <span
        className={`text-xs font-mono ${accent ? "text-violet-400" : "text-zinc-100"}`}
      >
        {value}
      </span>
    </div>
  );
}
