// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchInboundCompletedItems } from '../api/index';
import { inboundQueryKeys } from './inboundQueryKeys';

/**
 * @param {string} orderNumber
 * @param {boolean} enabled
 */
export function useInboundCompletedItems(orderNumber, enabled) {
  return useQuery({
    queryKey: inboundQueryKeys.completedItems(orderNumber),
    queryFn: () => fetchInboundCompletedItems(orderNumber),
    enabled: !!orderNumber && enabled,
    staleTime: 30 * 1000,
  });
}
