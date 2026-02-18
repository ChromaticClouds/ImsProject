// @ts-check

import { keepPreviousData } from '@tanstack/react-query';

/**
 * Api
 */
import { fetchPurchaseOrders } from '@/features/purchase-order/api/index.js';

/**
 * Hooks
 */
import { usePoParamStore } from '@/features/purchase-order/stores/use-po-param-store.js';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';

export const usePoListQuery = () => {
  const [view, page, size] = usePoParamStore(
    useShallow((s) => [s.view, s.page, s.size]),
  );

  return useQuery({
    queryKey: ['purchase-orders', view, page, size],
    queryFn: () => fetchPurchaseOrders({ view, page, size }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
    select: (data) => ({
      content: Array.isArray(data?.content) ? data.content : [],
      page:
        data?.page ?? ({
          number: page,
          size,
          totalElements: 0,
          totalPages: 1,
        }),
      summary: data?.summary ?? { orderKinds: 0, totalCount: 0, totalPrice: 0 },
    }),
  });
};
