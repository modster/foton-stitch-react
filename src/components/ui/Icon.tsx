import React from 'react';

interface IconProps {
  readonly name: string;
  readonly className?: string;
  readonly size?: number;
  readonly filled?: boolean;
}

export const Icon: React.FC<IconProps> = ({
  name,
  className = '',
  size = 24,
  filled = false,
}) => {
  return (
    <span
      className={`material-symbols-outlined inline-block select-none leading-none ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        fontSize: size,
      }}
    >
      {name}
    </span>
  );
};