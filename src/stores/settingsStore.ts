import { create } from 'zustand';
import type { SettingsSection } from '../types/settings';
import { SETTINGS_SECTIONS } from '../data/mockData';

interface SettingsState {
  readonly sections: ReadonlyArray<SettingsSection>;
  readonly toggleValues: Record<string, boolean>;
}

interface SettingsActions {
  toggleSetting: (id: string) => void;
}

type SettingsStore = SettingsState & SettingsActions;

const initialToggles = SETTINGS_SECTIONS.flatMap((s) => s.rows)
  .filter((r) => r.action.type === 'toggle')
  .reduce<Record<string, boolean>>((acc, r) => {
    acc[r.id] = r.action.value as boolean;
    return acc;
  }, {});

export const useSettingsStore = create<SettingsStore>((set) => ({
  sections: SETTINGS_SECTIONS,
  toggleValues: initialToggles,

  toggleSetting: (id: string) =>
    set((s) => ({
      toggleValues: { ...s.toggleValues, [id]: !s.toggleValues[id] },
    })),
}));