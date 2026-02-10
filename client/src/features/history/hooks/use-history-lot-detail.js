// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchHistoryLotDetail } from '../api/index';
import { historyQueryKeys } from './historyQueryKeys.js';

export function useHistoryLotDetail(lotId) {
  return useQuery({
    queryKey: historyQueryKeys.lotDetail(lotId),
    queryFn: () => fetchHistoryLotDetail(lotId),
    enabled: !!lotId,
    staleTime: 10_000,
  });
}
