import React from 'react';
import type { SettingsSection as SettingsSectionType } from '../../../types/settings';
import { SettingsRow } from './SettingsRow';

interface SettingsSectionProps {
  readonly section: SettingsSectionType;
  readonly className?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ section, className = '' }) => {
  return (
    <div className={className}>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">
        {section.title}
      </h3>
      <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container">
        {section.rows.map((row, i) => (
          <SettingsRow key={row.id} row={row} isLast={i === section.rows.length - 1} />
        ))}
      </div>
    </div>
  );
};