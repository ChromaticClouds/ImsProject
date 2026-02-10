// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchInboundSafetyStocks } from '../api/index';

/** @param {{ productIds: number[], enabled?: boolean }} params */
export function useInboundSafetyStocks({ productIds, enabled = true }) {
  const ids = Array.isArray(productIds) ? productIds.filter(Boolean) : [];

  return useQuery({
    queryKey: ['inbound-safety-stocks', ids],
    queryFn: () => fetchInboundSafetyStocks(ids),
    enabled: enabled && ids.length > 0,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}