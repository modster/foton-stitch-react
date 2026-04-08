interface FocusSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function FocusSlider({ value, onChange }: FocusSliderProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 h-48 w-12 flex flex-col items-center justify-between py-4 z-10 pointer-events-auto">
      <div className="h-full w-0.5 bg-zinc-800 relative">
        <div
          className="absolute -left-[3px] bg-violet-400 rounded-full ring-4 ring-violet-400/20"
          style={{ top: `${pct}%`, width: 8, height: 8, transform: "translateY(-50%)" }}
        />
        <div className="absolute -left-2 top-0 w-1.5 h-px bg-zinc-600" />
        <div className="absolute -left-2 top-1/2 w-1.5 h-px bg-zinc-600" />
        <div className="absolute -left-2 top-full w-1.5 h-px bg-zinc-600" />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <span className="text-[8px] font-black text-zinc-500 rotate-90 absolute -right-4 top-1/2 -translate-y-1/2 whitespace-nowrap tracking-widest">
        FOCUS
      </span>
    </div>
  );
}
