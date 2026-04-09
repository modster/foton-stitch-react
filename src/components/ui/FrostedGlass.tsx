import React from 'react';

interface FrostedGlassProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly intensity?: 'md' | '2xl' | 'light';
  readonly as?: 'div' | 'nav' | 'header' | 'footer' | 'section';
}

const intensityMap = {
  md: 'backdrop-blur-md',
  '2xl': 'backdrop-blur-2xl',
  light: 'backdrop-blur-sm',
} as const;

const bgMap = {
  md: 'bg-zinc-950/60',
  '2xl': 'bg-zinc-900/80',
  light: 'bg-black/40',
} as const;

export const FrostedGlass: React.FC<FrostedGlassProps> = ({
  children,
  className = '',
  intensity = 'md',
  as: Component = 'div',
}) => {
  return (
    <Component
      className={`${bgMap[intensity]} ${intensityMap[intensity]} border border-zinc-800 ${className}`}
    >
      {children}
    </Component>
  );
};