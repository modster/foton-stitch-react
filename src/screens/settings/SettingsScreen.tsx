import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../camera/components/TopAppBar';
import { BottomNavBar } from '../camera/components/BottomNavBar';
import { SettingsSection } from './components/SettingsSection';
import { useSettingsStore } from '../../stores/settingsStore';

interface SettingsScreenProps {
  readonly className?: string;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const sections = useSettingsStore((s) => s.sections);

  return (
    <div className={`h-screen w-screen bg-background flex flex-col ${className}`}>
      <TopAppBar
        title="Settings"
        showBack
        onBack={() => navigate('/')}
        rightContent={null}
      />
      <div className="flex-grow overflow-y-auto pt-14 pb-28 px-4 max-w-2xl mx-auto w-full">
        <div className="space-y-8 py-6">
          {sections.map((section) => (
            <SettingsSection key={section.id} section={section} />
          ))}
        </div>
      </div>
      <BottomNavBar showShutter={false} />
    </div>
  );
};