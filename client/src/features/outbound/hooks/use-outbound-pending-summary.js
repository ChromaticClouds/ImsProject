// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchOutboundPendingSummary } from '../api/index';
import { outboundQueryKeys } from './outboundQueryKeys.js';

/** @param {{ from: string, to: string, userId?: number, page?: number, size?: number }} params */
export function useOutboundPendingSummary(params) {
  return useQuery({
    queryKey: outboundQueryKeys.pendingSummary(params),
    queryFn: () => fetchOutboundPendingSummary(params),
    staleTime: 10 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}





