// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchInboundPendingSummary } from '@/services/api';
import { inboundQueryKeys } from './inboundQueryKeys';

/**
 * @param {import('../types').InboundPendingSearch} params
 * @returns {import('@tanstack/react-query').UseQueryResult<import('../types').InboundPendingSummaryResponse, Error>}
 */
export function useInboundPendingSummary(params) {
  return useQuery({
    queryKey: inboundQueryKeys.pendingSummary(params),
    queryFn: () => fetchInboundPendingSummary(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}
