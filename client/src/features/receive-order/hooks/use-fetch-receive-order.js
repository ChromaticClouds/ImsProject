// @ts-check

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assignOutboundManager, getReceiveOrders } from '../api/index.js';
import { toast } from 'sonner';

/**
 * 수주(입고 예정) 목록 조회 + 출고 담당자 지정/변경을 위한 훅
 *
 * - 검색 조건(searchCond)에 따라 수주 목록을 조회한다.
 * - 담당자 변경 시 optimistic update를 적용하여 즉시 UI를 반영한다.
 * - 요청 실패 시 이전 캐시 상태로 rollback한다.
 *
 * @param {{
 *  search?: string | null,
 *  fromDate?: string | null,
 *  toDate?: string | null
 * }} searchCond
 * 조회에 사용할 검색 조건
 *
 * @returns {{
 *  orders: Array<{
 *    orderNumber: string,
 *    userName: string,
 *    vendorName: string,
 *    bossName: string,
 *    orderDate: string,
 *    receiveDate: string | null,
 *    itemCount: number,
 *    totalPrice: number,
 *    managerId: number | null,
 *    managerName: string | null
 *  }>,
 *  mutation: import('@tanstack/react-query').UseMutationResult<
 *    any,
 *    unknown,
 *    { orderNumber: string, managerId: number | null }
 *  >
 * }}
 */
export const useFetchReceiveOrder = (searchCond) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['receive-orders', searchCond],
    queryFn: () => getReceiveOrders(searchCond),
    staleTime: 0,
  });

  const mutation = useMutation({
    mutationFn: assignOutboundManager,

    /**
     * 담당자 변경 optimistic update
     *
     * - 서버 응답을 기다리지 않고 캐시를 먼저 갱신한다.
     * - 실패 시 이전 상태로 rollback하기 위해 prev 값을 반환한다.
     */
    onMutate: async ({ orderNumber, managerId }) => {
      await queryClient.cancelQueries({
        queryKey: ['receive-orders', searchCond],
      });

      const prev = queryClient.getQueryData(['receive-orders', searchCond]);

      queryClient.setQueryData(
        ['receive-orders', searchCond],
        /** @param {ApiResponse<import('../api/index.js').ReceivedOrder[]>} old */
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

    onSuccess: (_data, variables) => {
      toast.success('담당자가 지정완료됐습니다.')
    },

    /**
     * 담당자 변경 실패 시 optimistic update rollback
     */
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['receive-orders', searchCond], ctx.prev);
      }
    },

    /**
     * 요청 성공/실패 여부와 관계없이 서버 상태와 동기화
     */
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['receive-orders', searchCond],
      });
    },
  });

  const orders = data?.data ?? [];

  return { orders, mutation };
};
