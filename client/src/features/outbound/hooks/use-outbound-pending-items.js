// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchOutboundPendingItems } from '../api/index';
import { outboundQueryKeys } from './outboundQueryKeys.js';

/** @param {string} orderNumber @param {boolean} enabled */
export function useOutboundPendingItems(orderNumber, enabled) {
  return useQuery({
    queryKey: outboundQueryKeys.pendingItems(orderNumber),
    queryFn: () => fetchOutboundPendingItems(orderNumber),
    enabled: !!orderNumber && !!enabled,
    staleTime: 10 * 1000,
  });
}
