import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CameraScreen } from '../screens/camera/CameraScreen';
import { GalleryScreen } from '../screens/gallery/GalleryScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { registerMode } from '../extensions/registry';
import type { CameraModeExtension, ShutterVariant } from '../types/camera';
import { lazy } from 'react';

const LazyPhotoMode = lazy(() => import('../screens/modes/photo/PhotoMode').then(m => ({ default: m.PhotoMode })));
const LazyVideoMode = lazy(() => import('../screens/modes/video/VideoMode').then(m => ({ default: m.VideoMode })));
const LazyLongExposureMode = lazy(() => import('../screens/modes/long-exposure/LongExposureMode').then(m => ({ default: m.LongExposureMode })));

const photoMode: CameraModeExtension = {
  id: 'photo',
  label: 'PRO',
  icon: 'photo_camera',
  component: LazyPhotoMode as unknown as React.LazyExoticComponent<React.ComponentType<object>>,
  hudChips: [
    { label: 'SHUTTER', value: '1/500', unit: 's' },
    { label: 'ISO', value: '200' },
    { label: 'EV', value: '-0.7' },
    { label: 'WB', value: '5500K' },
    { label: 'f/', value: '1.8' },
  ],
  shutterVariant: 'photo' as ShutterVariant,
};

const videoMode: CameraModeExtension = {
  id: 'video',
  label: 'VIDEO',
  icon: 'videocam',
  component: LazyVideoMode as unknown as React.LazyExoticComponent<React.ComponentType<object>>,
  hudChips: [
    { label: 'FPS', value: '30' },
    { label: 'RES', value: '4K' },
    { label: 'BITRATE', value: '50' },
    { label: 'WB', value: '5500K' },
  ],
  shutterVariant: 'video' as ShutterVariant,
};

const longExposureMode: CameraModeExtension = {
  id: 'long-exposure',
  label: 'LONG EXP',
  icon: 'motion_photos_on',
  component: LazyLongExposureMode as unknown as React.LazyExoticComponent<React.ComponentType<object>>,
  hudChips: [
    { label: 'EXPOSURE', value: '2s' },
    { label: 'ISO', value: '100' },
    { label: 'EV', value: '+0.0' },
    { label: 'WB', value: 'Auto' },
  ],
  shutterVariant: 'long-exposure' as ShutterVariant,
};

registerMode(photoMode);
registerMode(videoMode);
registerMode(longExposureMode);

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CameraScreen />} />
      <Route path="/gallery" element={<GalleryScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
    </Routes>
  );
};