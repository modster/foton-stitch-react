import { useCallback } from 'react';
import { useGalleryStore } from '../../../stores/galleryStore';

export function useGallery() {
  const store = useGalleryStore();

  const toggleSelect = useCallback((id: string) => {
    store.toggleSelectItem(id);
  }, [store]);

  const clearSelection = useCallback(() => {
    store.clearSelection();
  }, [store]);

  return {
    items: store.items,
    selectedItemIds: store.selectedItemIds,
    filterMode: store.filterMode,
    toggleSelect,
    clearSelection,
    setFilterMode: store.setFilterMode,
  };
}