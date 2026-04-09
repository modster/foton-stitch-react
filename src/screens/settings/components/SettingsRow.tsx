import React from 'react';
import type { SettingsRow as SettingsRowType } from '../../../types/settings';
import { Icon } from '../../../components/ui/Icon';
import { Toggle } from '../../../components/ui/Toggle';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useCameraStore } from '../../../stores/cameraStore';

const CAMERA_TOGGLE_MAP = {
  grid: {
    value: (state: ReturnType<typeof useCameraStore.getState>) => state.showGrid,
    toggle: (state: ReturnType<typeof useCameraStore.getState>) => state.toggleGrid(),
  },
  raw: {
    value: (state: ReturnType<typeof useCameraStore.getState>) => state.showRaw,
    toggle: (state: ReturnType<typeof useCameraStore.getState>) => state.toggleRaw(),
  },
  level: {
    value: (state: ReturnType<typeof useCameraStore.getState>) => state.showLevel,
    toggle: (state: ReturnType<typeof useCameraStore.getState>) => state.toggleLevel(),
  },
  histogram: {
    value: (state: ReturnType<typeof useCameraStore.getState>) => state.showHistogram,
    toggle: (state: ReturnType<typeof useCameraStore.getState>) => state.toggleHistogram(),
  },
  overexposure: {
    value: (state: ReturnType<typeof useCameraStore.getState>) => state.showOverexposureWarning,
    toggle: (state: ReturnType<typeof useCameraStore.getState>) => state.toggleOverexposureWarning(),
  },
} as const;

interface SettingsRowProps {
  readonly row: SettingsRowType;
  readonly isLast?: boolean;
  readonly className?: string;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({ row, isLast = false, className = '' }) => {
  const toggleValues = useSettingsStore((s) => s.toggleValues);
  const selectValues = useSettingsStore((s) => s.selectValues);
  const toggleSetting = useSettingsStore((s) => s.toggleSetting);
  const cycleSetting = useSettingsStore((s) => s.cycleSetting);
  const cameraState = useCameraStore();

  const cameraSync = CAMERA_TOGGLE_MAP[row.id as keyof typeof CAMERA_TOGGLE_MAP];
  const settingsValue = toggleValues[row.id] ?? (row.action.type === 'toggle' ? (row.action.value as boolean) : false);
  const checked = cameraSync ? cameraSync.value(cameraState) : settingsValue;
  const selectValue = selectValues[row.id] ?? (row.action.value as string | undefined) ?? row.description ?? '';

  const handleChange = () => {
    if (cameraSync) {
      cameraSync.toggle(cameraState);
      return;
    }
    toggleSetting(row.id);
  };

  const handleSelect = () => {
    cycleSetting(row.id);
  };

  return (
    <div className={`flex items-center justify-between p-4 ${!isLast ? 'border-b border-outline-variant' : ''} ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-surface-container-low border border-zinc-800 flex items-center justify-center">
          <Icon
            name={row.icon}
            size={20}
            className={row.iconColor === 'tertiary' ? 'text-tertiary' : 'text-primary'}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-on-surface">{row.label}</span>
          {row.description && (
            <span className="text-xs text-on-surface-variant">{row.description}</span>
          )}
        </div>
      </div>
      <div>
        {row.action.type === 'toggle' ? (
          <Toggle checked={checked} onChange={handleChange} label={row.label} />
        ) : row.action.type === 'select' ? (
          <button
            type="button"
            onClick={handleSelect}
            className="min-w-28 rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-right text-xs font-mono text-violet-400 transition-colors hover:border-violet-400/40"
          >
            {selectValue}
          </button>
        ) : row.action.type === 'link' ? (
          <Icon name="chevron_right" size={20} className="text-on-surface-variant" />
        ) : null}
      </div>
    </div>
  );
};