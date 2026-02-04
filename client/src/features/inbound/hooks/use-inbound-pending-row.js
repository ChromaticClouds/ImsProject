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
  const items = cachedItems ?? fetchedItems;

  useEffect(() => {
    console.log('orderNumber:', orderNumber, 'isOpen:', isOpen);
    if (!isOpen) return;
    if (itemsMap[orderNumber]) return;
    if (!fetchedItems.length) return;

    setItemsMap((prev) => {
      if (prev[orderNumber]) return prev;
      return { ...prev, [orderNumber]: fetchedItems };
    });
  }, [isOpen, orderNumber, fetchedItems, itemsMap, setItemsMap]);

  const toggle = () => {
    const next = new Set(expanded);
    if (next.has(orderNumber)) next.delete(orderNumber);
    else next.add(orderNumber);
    setExpanded(next);
  };

  return {
    isOpen,
    toggle,
    items,
    itemsLoading: itemsQuery.isFetching,
  };
}
