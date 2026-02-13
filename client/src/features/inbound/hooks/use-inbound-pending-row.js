// @ts-check
import { useEffect, useMemo } from 'react';
import { useInboundPendingCtx } from '../providers/inbound-pending-provider';
import { useInboundPendingItems } from './use-inbound-pending-items';

/**
 * @param {string} orderNumber
 */
export function useInboundPendingRow(orderNumber) {
  const { expanded, setExpanded, itemsMap, setItemsMap } = useInboundPendingCtx();
  const isOpen = expanded.has(orderNumber);

  const itemsQuery = useInboundPendingItems(orderNumber, isOpen);

  const fetchedItems = useMemo(
    () => (Array.isArray(itemsQuery.data) ? itemsQuery.data : []),
    [itemsQuery.data]
  );

  const cachedItems = itemsMap[orderNumber];

  const items = fetchedItems.length ? fetchedItems : (cachedItems ?? []);

  useEffect(() => {
    if (!isOpen) return;
    if (!fetchedItems.length) return;

    setItemsMap((prev) => {
      const prevItems = prev[orderNumber];

      if (prevItems && JSON.stringify(prevItems) === JSON.stringify(fetchedItems)) return prev;

      return { ...prev, [orderNumber]: fetchedItems };
    });
  }, [isOpen, orderNumber, fetchedItems, setItemsMap]);

  const toggle = () => {
    const next = new Set(expanded);
    if (next.has(orderNumber)) next.delete(orderNumber);
    else next.add(orderNumber);
    setExpanded(next);
  };

  const close = () => {
    if (!isOpen) return;
    const next = new Set(expanded);
    next.delete(orderNumber);
    setExpanded(next);
  };

  return {
    isOpen,
    toggle,
    close,
    items,
    itemsLoading: itemsQuery.isFetching,
  };
}
