import React from 'react';

interface PhotoModeProps {
  readonly className?: string;
}

export const PhotoMode: React.FC<PhotoModeProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
      <svg className="absolute top-20 left-6 pointer-events-none z-10" height="30" width="60" viewBox="0 0 60 30">
        <path
          d="M0 30 L5 25 L10 28 L15 15 L20 20 L25 5 L30 18 L35 22 L40 10 L45 15 L50 25 L55 22 L60 30 Z"
          fill="#fafafa"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};