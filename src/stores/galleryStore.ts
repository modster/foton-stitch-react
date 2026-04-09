import { create } from 'zustand';
import type { GalleryItem } from '../types/gallery';
import { GALLERY_ITEMS } from '../data/mockData';

interface GalleryState {
  readonly items: ReadonlyArray<GalleryItem>;
  readonly selectedItemIds: ReadonlyArray<string>;
  readonly filterMode: string;
}

interface GalleryActions {
  toggleSelectItem: (id: string) => void;
  clearSelection: () => void;
  setFilterMode: (mode: string) => void;
  addItem: (item: GalleryItem) => void;
}

type GalleryStore = GalleryState & GalleryActions;

export const useGalleryStore = create<GalleryStore>((set) => ({
  items: GALLERY_ITEMS,
  selectedItemIds: [],
  filterMode: 'all',

  toggleSelectItem: (id: string) =>
    set((s) => ({
      selectedItemIds: s.selectedItemIds.includes(id)
        ? s.selectedItemIds.filter((i) => i !== id)
        : [...s.selectedItemIds, id],
    })),
  clearSelection: () =>
    set({ selectedItemIds: [] }),
  setFilterMode: (mode: string) =>
    set({ filterMode: mode }),
  addItem: (item: GalleryItem) =>
    set((s) => ({
      items: [item, ...s.items],
    })),
}));