// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchHistoryLotDetail } from '../api/index';
import { historyQueryKeys } from './historyQueryKeys.js';

/** @param {number | null} lotId */
export function useHistoryLotDetail(lotId) {
  return useQuery({
    queryKey: historyQueryKeys.lotDetail(lotId),
    queryFn: () => {
      if (!lotId) throw new Error('이력 ID가 필요합니다.');
      return fetchHistoryLotDetail(lotId);
    },
    enabled: !!lotId,
    staleTime: 10_000,
  });
}
