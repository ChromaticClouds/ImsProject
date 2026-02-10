// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchOutboundCompletedTodaySummary } from '../api/index';
import { outboundQueryKeys } from './outboundQueryKeys.js';

/** @param {{ page?: number, size?: number }} params */
export function useOutboundCompletedTodaySummary(params) {
  return useQuery({
    queryKey: outboundQueryKeys.completedTodaySummary(params),
    queryFn: () => fetchOutboundCompletedTodaySummary(params),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}


