import React from 'react';
import { LongExposureMode } from './LongExposureMode';

interface StarsModeProps {
  readonly className?: string;
}

export const StarsMode: React.FC<StarsModeProps> = (props) => {
  return <LongExposureMode {...props} subMode="stars" />;
};