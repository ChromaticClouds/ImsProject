// @ts-check

/**
 * @import { ReceivedOrder } from '../api/index.js'
 */

/**
 * Api
 */
import { assignOutboundManager } from '@/features/receive-order/api/index.js';

/**
 * Hooks
 */
import { useReceiveOrderFilterStore } from '@/features/receive-order/stores/use-receive-order-filter-store.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

/**
 * Utils
 */
import { toast } from 'sonner';
import { formatToIsoDate } from '@/features/receive-order/utils/format-date.js';

export const useAssignManager = () => {
  const [search, dateRange, salerId] = useReceiveOrderFilterStore(
    useShallow((s) => [s.search, s.dateRange, s.salerId]),
  );

  const fromDate = formatToIsoDate(dateRange?.from);
  const toDate = formatToIsoDate(dateRange?.to);

  const queryKey = useMemo(
    () => ['receive-orders', search ?? null, salerId ?? null, fromDate ?? null, toDate ?? null],
    [search, salerId, fromDate, toDate],
  );

  const queryClient = useQueryClient();

  return {
    mutation: useMutation({
      mutationFn: assignOutboundManager,

      /**
       * 담당자 변경 optimistic update
       *
       * - 서버 응답을 기다리지 않고 캐시를 먼저 갱신한다.
       * - 실패 시 이전 상태로 rollback하기 위해 prev 값을 반환한다.
       */
      onMutate: async ({ orderNumber, managerId }) => {
        await queryClient.cancelQueries({ queryKey });

        const prev = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(
          queryKey,
          /** @param {ApiResponse<ReceivedOrder[]>} old */
          (old) => {
            if (!old) return old;

            return {
              ...old,
              data: old.data.map((o) =>
                o.orderNumber === orderNumber
                  ? {
                      ...o,
                      managerId,
                      managerName: managerId == null ? null : o.managerName,
                    }
                  : o,
              ),
            };
          },
        );

        return { prev };
      },

      onSuccess: () => toast.success('요청이 성공적으로 완료되었습니다.'),

      /**
       * 담당자 변경 실패 시 optimistic update rollback
       */
      onError: (err, _vars, ctx) => {
        if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev);
      },

      /**
       * 요청 성공/실패 여부와 관계없이 서버 상태와 동기화
       */
      onSettled: () => queryClient.invalidateQueries({ queryKey }),
    }),
  };
};
