// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchOutboundCompletedItems } from '../api/index';
import { outboundQueryKeys } from './outboundQueryKeys.js';

/** @param {string} orderNumber @param {boolean} enabled */
export function useOutboundCompletedItems(orderNumber, enabled) {
  return useQuery({
    queryKey: outboundQueryKeys.completedItems(orderNumber),
    queryFn: () => fetchOutboundCompletedItems(orderNumber),
    enabled: !!orderNumber && !!enabled,
    staleTime: 10 * 1000,
  });
}
