import React from 'react';

interface FilterChipProps {
  readonly label: string;
  readonly active?: boolean;
  readonly onClick?: () => void;
  readonly className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-150 active:scale-95 ${
        active
          ? 'bg-primary text-on-primary'
          : 'border border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
      } ${className}`}
    >
      {label}
    </button>
  );
};