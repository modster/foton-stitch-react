export interface EXIFData {
  readonly shutter: string;
  readonly iso: string;
  readonly aperture: string;
  readonly whiteBalance: string;
  readonly focalLength: string;
}

export type GalleryItemType = 'photo' | 'video';

export interface GalleryItem {
  readonly id: string;
  readonly type: GalleryItemType;
  readonly src: string;
  readonly alt: string;
  readonly span: 'full' | 'half' | 'quarter';
  readonly exif?: EXIFData;
  readonly isFeatured?: boolean;
  readonly videoSrc?: string;
}

export interface GalleryState {
  readonly items: ReadonlyArray<GalleryItem>;
  readonly selectedItemIds: ReadonlyArray<string>;
  readonly filterMode: string;
}

export interface GalleryActions {
  toggleSelectItem: (id: string) => void;
  clearSelection: () => void;
  setFilterMode: (mode: string) => void;
}