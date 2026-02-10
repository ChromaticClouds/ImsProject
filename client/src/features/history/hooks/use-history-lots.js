// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchHistoryLots } from '../api/index';
import { historyQueryKeys } from './historyQueryKeys.js';

export function useHistoryLots(params) {
  return useQuery({
    queryKey: historyQueryKeys.lots(params),
    queryFn: () => fetchHistoryLots(params),
    staleTime: 10_000,
    gcTime: 5 * 60_000,
  });
}
