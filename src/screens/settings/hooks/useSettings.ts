import { useCallback } from 'react';
import { useSettingsStore } from '../../../stores/settingsStore';

export function useSettings() {
  const store = useSettingsStore();

  const toggle = useCallback((id: string) => {
    store.toggleSetting(id);
  }, [store]);

  return {
    sections: store.sections,
    toggleValues: store.toggleValues,
    toggle,
  };
}