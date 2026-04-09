import React from 'react';

interface BentoCardProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly as?: 'div' | 'section';
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component
      className={`rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-2xl p-4 ${className}`}
    >
      {children}
    </Component>
  );
};