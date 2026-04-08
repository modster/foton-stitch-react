import { cameraEngine } from "@/core/camera/CameraEngine";
import type {
  ModuleContext,
  ModuleSettings,
  ModuleUI,
  EventBus,
  TopBarItem,
  BottomBarItem,
  HUDChipConfig,
} from "@/core/registry/types";

interface UIActions {
  setTopBarItems(items: TopBarItem[]): void;
  setBottomBarItems(items: BottomBarItem[]): void;
  showHUDChip(chip: HUDChipConfig): void;
  hideHUDChip(id: string): void;
  clearAll(): void;
}

export function createModuleContext(
  _moduleId: string,
  uiActions: UIActions,
): ModuleContext {
  const settings = createModuleSettings(_moduleId);
  const events = createEventBus();
  const ui: ModuleUI = {
    setTopBarItems: uiActions.setTopBarItems,
    setBottomBarItems: uiActions.setBottomBarItems,
    showHUDChip: uiActions.showHUDChip,
    hideHUDChip: uiActions.hideHUDChip,
    clearAll: uiActions.clearAll,
  };

  return {
    cameraStream: cameraEngine.getStream(),
    requestCameraStream: async (constraints?: MediaStreamConstraints) => {
      const stream = await cameraEngine.startStream(constraints);
      return stream;
    },
    releaseCameraStream: () => {
      cameraEngine.stopStream();
    },
    settings,
    events,
    ui,
  };
}

function createModuleSettings(moduleId: string): ModuleSettings {
  const prefix = `foton.module.${moduleId}.`;
  const listeners = new Map<string, Set<(value: unknown) => void>>();

  return {
    get<T = string>(key: string): T | undefined {
      const raw = localStorage.getItem(prefix + key);
      if (raw === null) return undefined;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as T;
      }
    },
    set<T = string>(key: string, value: T): void {
      localStorage.setItem(prefix + key, JSON.stringify(value));
      const fullKey = prefix + key;
      listeners.get(fullKey)?.forEach((cb) => cb(value));
    },
    onChange(key: string, callback: (value: unknown) => void): () => void {
      const fullKey = prefix + key;
      if (!listeners.has(fullKey)) {
        listeners.set(fullKey, new Set());
      }
      listeners.get(fullKey)!.add(callback);
      return () => listeners.get(fullKey)?.delete(callback);
    },
  };
}

function createEventBus(): EventBus {
  const listeners = new Map<string, Set<(data?: unknown) => void>>();

  return {
    emit(event: string, data?: unknown): void {
      listeners.get(event)?.forEach((cb) => cb(data));
    },
    on(event: string, callback: (data?: unknown) => void): () => void {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(callback);
      return () => listeners.get(event)?.delete(callback);
    },
  };
}
