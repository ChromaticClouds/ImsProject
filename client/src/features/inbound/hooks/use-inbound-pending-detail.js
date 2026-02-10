// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchInboundPendingDetail } from '../api/index';

export function useInboundPendingDetail(orderNumber) {
  return useQuery({
    queryKey: ['inbound-pending-detail', orderNumber],
    queryFn: () => fetchInboundPendingDetail(orderNumber),
    enabled: !!orderNumber,
    staleTime: 30 * 1000,
  });
}
