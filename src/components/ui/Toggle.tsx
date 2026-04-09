import React from 'react';

interface ToggleProps {
  readonly checked: boolean;
  readonly onChange: () => void;
  readonly className?: string;
  readonly label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  className = '',
  label,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-primary' : 'bg-zinc-800'
      } ${className}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
};