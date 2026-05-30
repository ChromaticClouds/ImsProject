import { useMemo, useState } from 'react';
import { useItemsSearch } from '@/features/vendor/hooks/vendor-detail/use-items-search.js';

export function useVendorCreateItems({ enabled }) {
  const [itemKeyword, setItemKeyword] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const { data: itemsData, isFetching: itemsLoading } = useItemsSearch({
    keyword: itemKeyword.trim(),
    excludeAssigned: true,
  });

  const items = itemsData ?? [];

  const filteredItems = useMemo(() => {
    const selectedSet = new Set(selectedItems.map((item) => item.itemId));
    return items.filter((item) => !selectedSet.has(item.id));
  }, [items, selectedItems]);

  const resetItems = () => {
    setItemKeyword('');
    setSelectedItems([]);
  };

  const onSelectItem = (item) => {
    setSelectedItems((prev) => [
      ...prev,
      { itemId: item.id, itemName: item.name, unitPrice: 0 },
    ]);
    setItemKeyword('');
  };

  const onChangeUnitPrice = (itemId) => (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const unitPrice = value ? Number(value) : 0;

    setSelectedItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, unitPrice } : item,
      ),
    );
  };

  const onRemoveItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  const isValidItemsForSupplier = useMemo(() => {
    if (!enabled) return true;
    if (selectedItems.length === 0) return false;
    return selectedItems.every(
      (item) => Number.isFinite(item.unitPrice) && item.unitPrice > 0,
    );
  }, [enabled, selectedItems]);

  return {
    itemKeyword,
    setItemKeyword,
    selectedItems,
    filteredItems,
    itemsLoading,
    isValidItemsForSupplier,
    showSearchDropdown: enabled && itemKeyword.trim().length > 0,
    resetItems,
    onSelectItem,
    onChangeUnitPrice,
    onRemoveItem,
  };
}
