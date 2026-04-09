import React from 'react';
import { LongExposureMode } from './LongExposureMode';

interface WaterExposureModeProps {
  readonly className?: string;
}

export const WaterExposureMode: React.FC<WaterExposureModeProps> = (props) => {
  return <LongExposureMode {...props} subMode="water" />;
};