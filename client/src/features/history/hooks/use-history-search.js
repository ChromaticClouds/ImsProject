// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchHistorySearch } from '../api/index';
import { historyQueryKeys } from './historyQueryKeys.js';

export function useHistorySearch(q, enabled) {
  return useQuery({
    queryKey: historyQueryKeys.search(q),
    queryFn: () => fetchHistorySearch(q),
    enabled: !!enabled && !!q && q.trim().length >= 1,
    staleTime: 5_000,
  });
}
