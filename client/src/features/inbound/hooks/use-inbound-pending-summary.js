// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchInboundPendingSummary } from '@/services/api.js';

/**
 * @param {{ from: string, to: string, keyword?: string, page?: number, size?: number }} search
 */
export function useInboundPendingSummary(search) {
  return useQuery({
    queryKey: ['inbound-pending-summary', search],
    queryFn: () => fetchInboundPendingSummary(search),
    enabled: !!search?.from && !!search?.to,
    staleTime: 10 * 1000,
  });
}
