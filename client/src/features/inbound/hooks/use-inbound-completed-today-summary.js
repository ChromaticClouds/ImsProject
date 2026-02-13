// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchInboundCompletedTodaySummary } from '@/services/api';
import { inboundQueryKeys } from './inboundQueryKeys';

/**
 * @param {{ page?: number, size?: number, keyword?: string }} params
 */
export function useInboundCompletedTodaySummary(params) {
  const p = params ?? /** @type {any} */ ({});
  const safe = {
    page: Number.isFinite(p.page) ? p.page : 0,
    size: Number.isFinite(p.size) ? p.size : 50,
    keyword: typeof p.keyword === 'string' ? p.keyword : '',
  };

  return useQuery({
    queryKey: inboundQueryKeys.completedTodaySummary(safe),
    queryFn: () => fetchInboundCompletedTodaySummary(safe),
    staleTime: 0,
    refetchOnMount: 'always',
    placeholderData: (prev) => prev,
  });
}

