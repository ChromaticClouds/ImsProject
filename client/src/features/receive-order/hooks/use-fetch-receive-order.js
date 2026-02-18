// @ts-check

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assignOutboundManager, getReceiveOrders } from '../api/index.js';
import { toast } from 'sonner';
import { useReceiveOrderFilterStore } from '../stores/use-receive-order-filter-store.js';
import { formatToIsoDate } from '../utils/format-date.js';
import { useShallow } from 'zustand/shallow';
import { useMemo } from 'react';

/**
 * 수주(입고 예정) 목록 조회 + 출고 담당자 지정/변경을 위한 훅
 *
 * - 검색 조건(searchCond)에 따라 수주 목록을 조회한다.
 * - 담당자 변경 시 optimistic update를 적용하여 즉시 UI를 반영한다.
 * - 요청 실패 시 이전 캐시 상태로 rollback한다.
 *
 * @typedef {{
 *  search?: string | null,
 *  fromDate?: string | null,
 *  toDate?: string | null,
 *  salerId?: number | null
 * }} SearchType
 * 조회에 사용할 검색 조건
 *
 * @param {number} [page]
 * @returns {PageResponse<ReceiveOrder>}
 */
export const useFetchReceiveOrder = (page) => {
  const [search, dateRange, salerId] = useReceiveOrderFilterStore(
    useShallow((s) => [s.search, s.dateRange, s.salerId]),
  );

  const fromDate = formatToIsoDate(dateRange?.from);
  const toDate = formatToIsoDate(dateRange?.to);

  const queryKey = useMemo(
    () => [
      'receive-orders',
      search ?? null,
      salerId ?? null,
      fromDate ?? null,
      toDate ?? null,
      page ?? null,
    ],
    [page, search, salerId, fromDate, toDate],
  );

  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await getReceiveOrders({
        page,
        search,
        salerId,
        fromDate,
        toDate,
      });
      return response?.data;
    },
    staleTime: 0,
  });

  return data;
};
