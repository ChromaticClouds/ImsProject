// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchOutboundStockBrands } from '../api/index';

/** @param {{ type: string }} params */
export function useOutboundStockBrands(params, enabled = true) {
  return useQuery({
    queryKey: ['outbound-stock-brands', params],
    queryFn: () => fetchOutboundStockBrands(params),
    enabled: !!enabled && !!params?.type,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
