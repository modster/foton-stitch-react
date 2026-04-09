import React from 'react';

interface ViewfinderGridProps {
  readonly className?: string;
}

export const ViewfinderGrid: React.FC<ViewfinderGridProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20 ${className}`}>
      {Array.from({ length: 9 }).map((_, i) => {
        const isLastCol = (i % 3) === 2;
        const isLastRow = i >= 6;
        const borderRight = !isLastCol ? 'border-r border-zinc-100' : '';
        const borderBottom = !isLastRow ? 'border-b border-zinc-100' : '';
        return <div key={i} className={`${borderRight} ${borderBottom}`} />;
      })}
    </div>
  );
};