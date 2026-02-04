// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchInboundPendingItems } from '@/services/api';
import { inboundQueryKeys } from './inboundQueryKeys';

/**
 * @param {string} orderNumber
 * @param {boolean} enabled
 * @returns {import('@tanstack/react-query').UseQueryResult<import('../types').InboundPendingItem[], Error>}
 */
export function useInboundPendingItems(orderNumber, enabled) {
  return useQuery({
    queryKey: inboundQueryKeys.pendingItems(orderNumber),
    queryFn: () => fetchInboundPendingItems(orderNumber),
    enabled: !!orderNumber && enabled,
    staleTime: 30 * 1000,
  });
}
