// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchOutboundStockTypes } from '@/services/api.js';

export function useOutboundStockTypes(enabled = true) {
  return useQuery({
    queryKey: ['outbound-stock-types'],
    queryFn: fetchOutboundStockTypes,
    enabled: !!enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
