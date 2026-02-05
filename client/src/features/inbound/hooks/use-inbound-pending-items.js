// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchInboundPendingItems } from '@/services/api';
import { inboundQueryKeys } from './inboundQueryKeys';

/**
 * @param {string} orderNumber
 * @param {boolean} enabled
 */
export function useInboundPendingItems(orderNumber, enabled) {
  return useQuery({
    queryKey: inboundQueryKeys.pendingItems(orderNumber),
    queryFn: () => fetchInboundPendingItems(orderNumber),
    enabled: !!orderNumber && !!enabled,
    staleTime: 10 * 1000,
    placeholderData: (prev) => prev,
  });
}
