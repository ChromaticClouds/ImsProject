// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchOutboundStockProducts } from '../api/index';

/** @param {{ type: string, brand: string }} params */
export function useOutboundStockProducts(params, enabled = true) {
  return useQuery({
    queryKey: ['outbound-stock-products', params],
    queryFn: () => fetchOutboundStockProducts(params),
    enabled: !!enabled && !!params?.type && !!params?.brand,
    staleTime: 10 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
