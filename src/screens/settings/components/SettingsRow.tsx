import React from 'react';
import type { SettingsRow as SettingsRowType } from '../../../types/settings';
import { Icon } from '../../../components/ui/Icon';
import { Toggle } from '../../../components/ui/Toggle';
import { useSettingsStore } from '../../../stores/settingsStore';
import { useCameraStore } from '../../../stores/cameraStore';

const CAMERA_SYNC_IDS = new Set(['grid']);

interface SettingsRowProps {
  readonly row: SettingsRowType;
  readonly isLast?: boolean;
  readonly className?: string;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({ row, isLast = false, className = '' }) => {
  const toggleValues = useSettingsStore((s) => s.toggleValues);
  const toggleSetting = useSettingsStore((s) => s.toggleSetting);
  const cameraToggleGrid = useCameraStore((s) => s.toggleGrid);
  const cameraShowGrid = useCameraStore((s) => s.showGrid);

  const isCameraSync = CAMERA_SYNC_IDS.has(row.id);
  const settingsValue = toggleValues[row.id] ?? (row.action.type === 'toggle' ? (row.action.value as boolean) : false);
  const checked = isCameraSync ? cameraShowGrid : settingsValue;

  const handleChange = () => {
    if (isCameraSync) {
      cameraToggleGrid();
    }
    toggleSetting(row.id);
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
        ) : row.action.type === 'link' ? (
          <Icon name="chevron_right" size={20} className="text-on-surface-variant" />
        ) : null}
      </div>
    </div>
  );
};