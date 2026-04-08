import type { TopBarItem } from "@/core/registry/types";

interface TopAppBarProps {
  title: string;
  leftItems?: TopBarItem[];
  rightItems?: TopBarItem[];
}

export function TopAppBar({ title, leftItems = [], rightItems = [] }: TopAppBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex justify-between items-center px-4 h-14">
      <div className="flex items-center gap-1">
        {leftItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="text-violet-400 hover:bg-zinc-800 transition-colors active:scale-95 duration-150 p-2 rounded-full"
            title={item.label}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
          </button>
        ))}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
        <h1 className="font-[Geist] tracking-tight text-lg font-black text-zinc-100">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {rightItems.map((item) =>
          item.variant === "badge" ? (
            <span
              key={item.id}
              className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 border border-emerald-400/20 rounded"
            >
              {item.badgeText}
            </span>
          ) : (
            <button
              key={item.id}
              onClick={item.onClick}
              className="text-violet-400 hover:bg-zinc-800 transition-colors active:scale-95 duration-150 p-2 rounded-full"
              title={item.label}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
            </button>
          ),
        )}
      </div>
    </header>
  );
}
