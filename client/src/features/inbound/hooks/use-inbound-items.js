// @ts-check
import { useQuery } from '@tanstack/react-query';
import {
  fetchInboundPendingItems,
  fetchInboundCompletedItems,
} from '../api/index';

/**
 * @param {string} orderNumber
 * @param {'INBOUND_PENDING'|'INBOUND_COMPLETE'} status
 * @param {boolean} enabled
 */
export function useInboundItems(orderNumber, status, enabled) {
  return useQuery({
    queryKey: ['inbound-items', status, orderNumber],
    queryFn: async () => {
      if (status === 'INBOUND_COMPLETE') {
        return fetchInboundCompletedItems(orderNumber);
      }
      return fetchInboundPendingItems(orderNumber);
    },
    enabled: !!orderNumber && !!status && !!enabled,
    staleTime: 30 * 1000,
  });
}
