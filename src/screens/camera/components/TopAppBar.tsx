import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/ui/Icon';

interface TopAppBarProps {
  readonly title?: string;
  readonly showBack?: boolean;
  readonly onBack?: () => void;
  readonly leftContent?: React.ReactNode;
  readonly rightContent?: React.ReactNode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'Camera',
  showBack = false,
  onBack,
  leftContent,
  rightContent,
}) => {
  const navigate = useNavigate();

  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-14">
      <div className="flex items-center gap-1">
        {showBack && (
          <button
            onClick={handleBack}
            className="text-violet-400 hover:bg-zinc-800 transition-colors active:scale-95 duration-150 p-2 rounded-full"
          >
            <Icon name="arrow_back" size={20} />
          </button>
        )}
        {leftContent}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
        <h1 className="font-sans tracking-tight text-lg font-black text-zinc-100">{title}</h1>
      </div>
      {rightContent !== undefined ? (
        <div className="flex items-center gap-2">{rightContent}</div>
      ) : null}
    </header>
  );
};