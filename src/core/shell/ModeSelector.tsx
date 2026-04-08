import { useModuleStore } from "@/core/store/moduleStore";
import { registry } from "@/core/registry/ModuleRegistry";

export function ModeSelector() {
  const { activeModuleId, activate } = useModuleStore();
  const modules = registry.getAllModules();

  if (modules.length === 0) return null;

  return (
    <div className="h-16 bg-zinc-950 flex items-center justify-center gap-8 border-t border-zinc-900 z-40 overflow-x-auto no-scrollbar px-10">
      {modules.map((mod) => {
        const isActive = mod.id === activeModuleId;
        return (
          <button
            key={mod.id}
            onClick={() => activate(mod.id)}
            className="relative flex flex-col items-center group cursor-pointer"
          >
            <span
              className={`font-[Geist] text-[10px] uppercase tracking-widest transition-all ${
                isActive
                  ? "font-medium text-sm text-emerald-400"
                  : "font-medium text-zinc-500 hover:text-zinc-200"
              }`}
            >
              {mod.screens[0]?.label ?? mod.name}
            </span>
            {isActive && (
              <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1" />
            )}
          </button>
        );
      })}
    </div>
  );
}
