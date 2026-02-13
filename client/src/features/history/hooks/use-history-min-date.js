// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchHistoryMinDate } from '@/services/api.js';

/**
 * @param {boolean} enabled
 */
export function useHistoryMinDate(enabled) {
  return useQuery({
    queryKey: ['history-min-date'],
    queryFn: fetchHistoryMinDate,
    enabled: !!enabled,
    staleTime: 60 * 60 * 1000,
  });
}


