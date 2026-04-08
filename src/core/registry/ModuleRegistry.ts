import { createModuleContext } from "@/core/registry/ModuleContext";
import type {
  FotonModule,
  ModuleScreen,
  RegisteredModule,
  TopBarItem,
  BottomBarItem,
  HUDChipConfig,
} from "@/core/registry/types";

class ModuleRegistry {
  private modules = new Map<string, RegisteredModule>();
  private topBarItems: TopBarItem[] = [];
  private bottomBarItems: BottomBarItem[] = [];
  private hudChips = new Map<string, HUDChipConfig>();
  private onUIChangeCallbacks = new Set<() => void>();

  register(module: FotonModule): void {
    if (this.modules.has(module.id)) {
      console.warn(`Module "${module.id}" already registered, skipping.`);
      return;
    }
    this.modules.set(module.id, { module, context: null, active: false });
    this.notifyUIChange();
  }

  async activate(id: string): Promise<void> {
    const entry = this.modules.get(id);
    if (!entry) {
      console.error(`Module "${id}" not found.`);
      return;
    }
    if (entry.active) return;

    for (const [existingId, existing] of this.modules) {
      if (existing.active) {
        await this.deactivate(existingId);
      }
    }

    const ctx = createModuleContext(id, {
      setTopBarItems: (items) => {
        this.topBarItems = items;
        this.notifyUIChange();
      },
      setBottomBarItems: (items) => {
        this.bottomBarItems = items;
        this.notifyUIChange();
      },
      showHUDChip: (chip) => {
        this.hudChips.set(chip.id, chip);
        this.notifyUIChange();
      },
      hideHUDChip: (chipId) => {
        this.hudChips.delete(chipId);
        this.notifyUIChange();
      },
      clearAll: () => {
        this.topBarItems = [];
        this.bottomBarItems = [];
        this.hudChips.clear();
        this.notifyUIChange();
      },
    });

    entry.context = ctx;
    entry.active = true;
    entry.module.onActivate?.(ctx);
    this.notifyUIChange();
  }

  async deactivate(id: string): Promise<void> {
    const entry = this.modules.get(id);
    if (!entry || !entry.active) return;

    entry.module.onDeactivate?.();
    entry.context?.ui.clearAll();
    entry.context = null;
    entry.active = false;
    this.notifyUIChange();
  }

  async uninstall(id: string): Promise<void> {
    await this.deactivate(id);
    const entry = this.modules.get(id);
    if (entry) {
      entry.module.onDestroy?.();
      this.modules.delete(id);
      this.notifyUIChange();
    }
  }

  getModule(id: string): FotonModule | undefined {
    return this.modules.get(id)?.module;
  }

  getActiveModule(): FotonModule | undefined {
    for (const entry of this.modules.values()) {
      if (entry.active) return entry.module;
    }
    return undefined;
  }

  getActiveModuleId(): string | null {
    for (const [id, entry] of this.modules) {
      if (entry.active) return id;
    }
    return null;
  }

  getAllModules(): FotonModule[] {
    return [...this.modules.values()].map((e) => e.module);
  }

  getModuleScreens(): ModuleScreen[] {
    return this.getAllModules().flatMap((m) => m.screens);
  }

  getModuleSettings(): { moduleId: string; component: React.ComponentType }[] {
    const result: { moduleId: string; component: React.ComponentType }[] = [];
    for (const entry of this.modules.values()) {
      if (entry.module.settings) {
        result.push({ moduleId: entry.module.id, component: entry.module.settings });
      }
    }
    return result;
  }

  getTopBarItems(): TopBarItem[] {
    return this.topBarItems;
  }

  getBottomBarItems(): BottomBarItem[] {
    return this.bottomBarItems;
  }

  getHUDChips(): HUDChipConfig[] {
    return [...this.hudChips.values()];
  }

  onUIChange(callback: () => void): () => void {
    this.onUIChangeCallbacks.add(callback);
    return () => this.onUIChangeCallbacks.delete(callback);
  }

  private notifyUIChange(): void {
    for (const cb of this.onUIChangeCallbacks) cb();
  }
}

export const registry = new ModuleRegistry();
