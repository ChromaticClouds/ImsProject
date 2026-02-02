// @ts-check

import { useMemo, useState } from 'react';
import { useItemsSearch } from '@/features/vendor/hooks/use-items-search';
import { useDebounce } from '@/hooks/use-debounce.js';

/**
 * @typedef {{
 *   itemId: number
 *   itemName: string
 *   unitPrice: number
 * }} SelectedItem
 */

export function useSupplierItems() {
  /** 검색 키워드 */
  const [itemKeyword, setItemKeyword] = useState('');

  /** 선택된 품목 목록 */
  const [selectedItems, setSelectedItems] = useState(
    /** @type {SelectedItem[]} */ ([]),
  );

  const debouncedKeyword = useDebounce(itemKeyword.trim(), 500);

  /** 품목 검색 API */
  const { data: itemsData, isFetching: itemsLoading } = useItemsSearch({
    keyword: debouncedKeyword,
    excludeAssigned: true,
  });

  const items = /** @type {{ id: number, name: string }[]} */ (itemsData ?? []);

  /** 이미 선택된 품목 제외 */
  const filteredItems = useMemo(() => {
    const selectedSet = new Set(selectedItems.map((x) => x.itemId));
    return items.filter((it) => !selectedSet.has(it.id));
  }, [items, selectedItems]);

  /** 품목 선택 */
  const onSelectItem = (it) => {
    setSelectedItems((prev) => [
      ...prev,
      {
        itemId: it.id,
        itemName: it.name,
        unitPrice: 0,
      },
    ]);
    setItemKeyword('');
  };

  /** 단가 변경 */
  const onChangeUnitPrice = (itemId) => (e) => {
    const v = e.target.value.replace(/[^\d]/g, '');
    const num = v ? Number(v) : 0;

    setSelectedItems((prev) =>
      prev.map((x) => (x.itemId === itemId ? { ...x, unitPrice: num } : x)),
    );
  };

  /** 품목 제거 */
  const onRemoveItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((x) => x.itemId !== itemId));
  };

  return {
    // UI 상태
    itemKeyword,
    setItemKeyword,
    itemsLoading,

    // 렌더링 데이터
    filteredItems,
    selectedItems,

    // 액션
    onSelectItem,
    onChangeUnitPrice,
    onRemoveItem,
  };
}
