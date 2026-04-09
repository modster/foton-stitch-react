import React from 'react';

interface NewComponentProps {
  readonly children?: React.ReactNode;
  readonly className?: string;
}

export const NewComponent: React.FC<NewComponentProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`relative ${className}`} {...props}>
      {children}
    </div>
  );
};

export default NewComponent;