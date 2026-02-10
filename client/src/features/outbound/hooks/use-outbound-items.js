// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchOutboundPendingItems, fetchOutboundCompletedItems } from '../api/index';
import { outboundQueryKeys } from './outboundQueryKeys';

/**
 * @param {string} orderNumber
 * @param {'PENDING'|'COMPLETED'} kind
 * @param {boolean} enabled
 */
export function useOutboundItems(orderNumber, kind, enabled) {
  return useQuery({
    queryKey: kind === 'PENDING'
      ? outboundQueryKeys.pendingItems(orderNumber)
      : outboundQueryKeys.completedItems(orderNumber),
    queryFn: () =>
      kind === 'PENDING'
        ? fetchOutboundPendingItems(orderNumber)
        : fetchOutboundCompletedItems(orderNumber),
    enabled: !!orderNumber && !!enabled,
    staleTime: 5 * 1000,
  });
}
