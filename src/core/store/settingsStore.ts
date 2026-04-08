import { create } from "zustand";

interface SettingsState {
  values: Record<string, unknown>;
  get: <T = string>(key: string) => T | undefined;
  set: <T = string>(key: string, value: T) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  values: loadPersistedSettings(),

  get: <T = string>(key: string): T | undefined => {
    const raw = get().values[key];
    return raw as T | undefined;
  },

  set: <T = string>(key: string, value: T): void => {
    set((state) => {
      const next = { ...state.values, [key]: value };
      persistSettings(next);
      return { values: next };
    });
  },
}));

function loadPersistedSettings(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem("foton.settings");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistSettings(values: Record<string, unknown>): void {
  localStorage.setItem("foton.settings", JSON.stringify(values));
}
