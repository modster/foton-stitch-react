import { create } from 'zustand';
import type { SettingsSection } from '../types/settings';
import { SETTINGS_SECTIONS } from '../data/mockData';

interface SettingsState {
  readonly sections: ReadonlyArray<SettingsSection>;
  readonly toggleValues: Record<string, boolean>;
  readonly selectValues: Record<string, string>;
}

interface SettingsActions {
  toggleSetting: (id: string) => void;
  cycleSetting: (id: string) => void;
}

type SettingsStore = SettingsState & SettingsActions;

const initialToggles = SETTINGS_SECTIONS.flatMap((s) => s.rows)
  .filter((r) => r.action.type === 'toggle')
  .reduce<Record<string, boolean>>((acc, r) => {
    acc[r.id] = r.action.value as boolean;
    return acc;
  }, {});

const initialSelects = SETTINGS_SECTIONS.flatMap((s) => s.rows)
  .filter((r) => r.action.type === 'select')
  .reduce<Record<string, string>>((acc, r) => {
    acc[r.id] = (r.action.value as string | undefined) ?? r.action.options?.[0] ?? '';
    return acc;
  }, {});

export const useSettingsStore = create<SettingsStore>((set) => ({
  sections: SETTINGS_SECTIONS,
  toggleValues: initialToggles,
  selectValues: initialSelects,

  toggleSetting: (id: string) =>
    set((s) => ({
      toggleValues: { ...s.toggleValues, [id]: !s.toggleValues[id] },
    })),
  cycleSetting: (id: string) =>
    set((s) => {
      const row = s.sections.flatMap((section) => section.rows).find((candidate) => candidate.id === id);
      if (!row || row.action.type !== 'select' || !row.action.options?.length) {
        return s;
      }

      const fallbackValue = row.action.options[0] ?? '';
      const currentValue = s.selectValues[id] ?? (row.action.value as string | undefined) ?? fallbackValue;
      const currentIndex = row.action.options.indexOf(currentValue);
      const nextValue = row.action.options[(currentIndex + 1 + row.action.options.length) % row.action.options.length] ?? fallbackValue;

      return {
        selectValues: {
          ...s.selectValues,
          [id]: nextValue,
        },
      };
    }),
}));