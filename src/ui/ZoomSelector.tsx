interface ZoomSelectorProps {
  levels: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function ZoomSelector({
  levels,
  activeIndex,
  onChange,
}: ZoomSelectorProps) {
  return (
    <div className="flex items-center gap-4 bg-zinc-950/40 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800/50">
      {levels.map((level, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={
            i === activeIndex
              ? "text-[11px] font-black text-violet-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-700"
              : "text-[10px] font-bold text-zinc-400 hover:text-zinc-100 transition-colors"
          }
        >
          {level}
        </button>
      ))}
    </div>
  );
}
