// src/features/purchase-order/stores/use-purchase-order-selection-store.js
import { useMemo, useState } from 'react';

export const usePurchaseOrderSelectionStore = () => {
  const [selectedIds, setSelectedIds] = useState([]);

  const api = useMemo(() => {
    const toggle = (id, checked) => {
      setSelectedIds((prev) => {
        if (checked) return prev.includes(id) ? prev : [...prev, id];
        return prev.filter((x) => x !== id);
      });
    };

    const clear = () => setSelectedIds([]);

    const isSelected = (id) => selectedIds.includes(id);

    return { toggle, clear, isSelected };
  }, [selectedIds]);

  return { selectedIds, setSelectedIds, ...api };
};
