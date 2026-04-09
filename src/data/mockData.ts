import type { HUDChip, CameraLensOption } from '../types/camera';
import type { GalleryItem } from '../types/gallery';
import type { SettingsSection } from '../types/settings';

export const CAMERA_MODES: ReadonlyArray<{ readonly id: string; readonly label: string }> = [
  { id: 'photo', label: 'PRO' },
  { id: 'video', label: 'VIDEO' },
  { id: 'long-exposure', label: 'LONG EXP' },
];

export const PHOTO_HUD_CHIPS: ReadonlyArray<HUDChip> = [
  { label: 'SHUTTER', value: '1/500', unit: 's' },
  { label: 'ISO', value: '200' },
  { label: 'EV', value: '+0.3' },
  { label: 'WB', value: '5500K' },
  { label: 'f/', value: '1.8' },
];

export const VIDEO_HUD_CHIPS: ReadonlyArray<HUDChip> = [
  { label: 'FPS', value: '30' },
  { label: 'RES', value: '4K' },
  { label: 'BITRATE', value: '50' },
  { label: 'WB', value: '5500K' },
];

export const LENS_OPTIONS: ReadonlyArray<CameraLensOption> = [
  { id: 'ultra-wide', label: '0.5x', focalLength: '13mm' },
  { id: 'wide', label: '1x', focalLength: '26mm' },
  { id: 'telephoto', label: '2x', focalLength: '52mm' },
  { id: 'super-tele', label: '5x', focalLength: '130mm' },
];

export const LONG_EXPOSURE_DURATION_PRESETS: ReadonlyArray<string> = [
  '1s', '2s', '5s', '10s', '15s', '30s', 'B',
];

export const STARS_TRACKING_OPTIONS: ReadonlyArray<string> = [
  'OFF', 'ON',
];

export const GALLERY_ITEMS: ReadonlyArray<GalleryItem> = [
  {
    id: 'gallery-1',
    type: 'photo',
    src: '/placeholder-featured.jpg',
    alt: 'Featured photo - city skyline at night',
    span: 'full',
    isFeatured: true,
    exif: { shutter: '1/125', iso: '800', aperture: 'f/2.8', whiteBalance: '3200K', focalLength: '26mm' },
  },
  {
    id: 'gallery-2',
    type: 'photo',
    src: '/placeholder-2.jpg',
    alt: 'Long exposure light trails',
    span: 'half',
    exif: { shutter: '2s', iso: '100', aperture: 'f/11', whiteBalance: '5500K', focalLength: '52mm' },
  },
  {
    id: 'gallery-3',
    type: 'photo',
    src: '/placeholder-3.jpg',
    alt: 'Star trail composition',
    span: 'half',
    exif: { shutter: '30s', iso: '1600', aperture: 'f/2.8', whiteBalance: 'Auto', focalLength: '13mm' },
  },
  {
    id: 'gallery-4',
    type: 'photo',
    src: '/placeholder-4.jpg',
    alt: 'Portrait in natural light',
    span: 'quarter',
  },
  {
    id: 'gallery-5',
    type: 'photo',
    src: '/placeholder-5.jpg',
    alt: 'Close-up macro flower',
    span: 'quarter',
  },
  {
    id: 'gallery-6',
    type: 'photo',
    src: '/placeholder-6.jpg',
    alt: 'Sunset landscape',
    span: 'half',
  },
  {
    id: 'gallery-7',
    type: 'photo',
    src: '/placeholder-7.jpg',
    alt: 'Waterfall long exposure',
    span: 'half',
    exif: { shutter: '1s', iso: '50', aperture: 'f/22', whiteBalance: '6500K', focalLength: '26mm' },
  },
];

export const SETTINGS_SECTIONS: ReadonlyArray<SettingsSection> = [
  {
    id: 'capture',
    title: 'CAMTURE',
    rows: [
      { id: 'raw', icon: 'raw', iconColor: 'primary', label: 'RAW Capture', action: { type: 'toggle', value: false } },
      { id: 'jpeg-quality', icon: 'image', iconColor: 'primary', label: 'JPEG Quality', description: 'Maximum', action: { type: 'link' } },
      { id: 'grid', icon: 'grid_on', iconColor: 'primary', label: 'Show Grid', action: { type: 'toggle', value: true } },
    ],
  },
  {
    id: 'video',
    title: 'VIDEO',
    rows: [
      { id: 'video-res', icon: 'videocam', iconColor: 'primary', label: 'Video Resolution', description: '4K @ 30fps', action: { type: 'link' } },
      { id: 'stabilization', icon: 'stabilization', iconColor: 'primary', label: 'Video Stabilization', action: { type: 'toggle', value: true } },
    ],
  },
  {
    id: 'display',
    title: 'DISPLAY',
    rows: [
      { id: 'level', icon: 'straighten', iconColor: 'tertiary', label: 'Level', action: { type: 'toggle', value: false } },
      { id: 'histogram', icon: 'bar_chart', iconColor: 'tertiary', label: 'Histogram', action: { type: 'toggle', value: false } },
      { id: 'overexposure', icon: 'warning', iconColor: 'tertiary', label: 'Overexposure Warning', action: { type: 'toggle', value: false } },
    ],
  },
  {
    id: 'storage',
    title: 'STORAGE',
    rows: [
      { id: 'save-location', icon: 'folder', iconColor: 'primary', label: 'Save Location', description: 'Internal Storage', action: { type: 'link' } },
      { id: 'geotag', icon: 'location_on', iconColor: 'primary', label: 'Geotag Photos', action: { type: 'toggle', value: true } },
    ],
  },
  {
    id: 'about',
    title: 'ABOUT',
    rows: [
      { id: 'version', icon: 'info', iconColor: 'primary', label: 'Foton v0.0.1', description: 'Build 2024.1', action: { type: 'link' } },
    ],
  },
];

export const APP_TITLE = 'Foton';

export const NAV_ITEMS: ReadonlyArray<{ readonly id: string; readonly icon: string; readonly path: string; readonly label: string }> = [
  { id: 'camera', icon: 'photo_camera', path: '/', label: 'Camera' },
  { id: 'gallery', icon: 'photo_library', path: '/gallery', label: 'Gallery' },
  { id: 'settings', icon: 'settings', path: '/settings', label: 'Settings' },
];