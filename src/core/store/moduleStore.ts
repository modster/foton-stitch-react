import { create } from "zustand";
import { registry } from "@/core/registry/ModuleRegistry";

interface ModuleState {
  activeModuleId: string | null;
  installedModuleIds: string[];
  setActiveModuleId: (id: string | null) => void;
  activate: (id: string) => Promise<void>;
  deactivate: () => Promise<void>;
  refreshInstalled: () => void;
}

export const useModuleStore = create<ModuleState>((set) => ({
  activeModuleId: registry.getActiveModuleId(),
  installedModuleIds: registry.getAllModules().map((m) => m.id),

  setActiveModuleId: (id) => set({ activeModuleId: id }),

  activate: async (id: string) => {
    await registry.activate(id);
    set({
      activeModuleId: registry.getActiveModuleId(),
      installedModuleIds: registry.getAllModules().map((m) => m.id),
    });
  },

  deactivate: async () => {
    const currentId = registry.getActiveModuleId();
    if (currentId) await registry.deactivate(currentId);
    set({ activeModuleId: null });
  },

  refreshInstalled: () => {
    set({
      activeModuleId: registry.getActiveModuleId(),
      installedModuleIds: registry.getAllModules().map((m) => m.id),
    });
  },
}));
