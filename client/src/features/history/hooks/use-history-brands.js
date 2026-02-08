// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchHistoryBrands } from '@/services/api.js';
import { historyQueryKeys } from './historyQueryKeys.js';

export function useHistoryBrands(type) {
  return useQuery({
    queryKey: historyQueryKeys.brands(type),
    queryFn: () => fetchHistoryBrands(type),
    enabled: !!type,
    staleTime: 60_000,
  });
}
