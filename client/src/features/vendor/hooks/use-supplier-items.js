// @ts-check

import { useDebounce } from '@/hooks/use-debounce.js';
import { useState } from 'react';
import { useItemsSearch } from './use-items-search.js';

export function useSupplierItems(form) {
  const [itemKeyword, setItemKeyword] = useState('');

  const debouncedKeyword = useDebounce(itemKeyword.trim(), 500);

  const { data: itemsData, isFetching: itemsLoading } = useItemsSearch({
    keyword: debouncedKeyword,
    excludeAssigned: true,
  });

  const items = itemsData ?? [];

  const onSelectItem = (it) => {
    form.pushFieldValue('items', {
      itemId: it.id,
      itemName: it.name,
      unitPrice: 0,
    });
    setItemKeyword('');
  };

  const onRemoveItem = (index) => {
    form.removeFieldValue('items', index);
  };

  return {
    itemKeyword,
    setItemKeyword,
    itemsLoading,
    items,
    onSelectItem,
    onRemoveItem,
  };
}
