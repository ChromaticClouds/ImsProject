// @ts-check

import { usePoListQuery } from '@/features/purchase-order/hooks/use-po-list-query.js';
import { useContext } from 'react';
import { createContext } from 'react';

/**
 * @import { Context } from 'react'
 */

const PoListContext = createContext(
  /** @type {(OrderResponse & { isFetching: boolean }) | null} */ (null),
);

export const usePoListContext = () => {
  const ctx = useContext(PoListContext);
  if (!ctx) throw new Error('PoListContext is not provided');
  return ctx;
};

/** @param {React.PropsWithChildren} props */
export const PoListProvider = ({ children }) => {
  const { data, isFetching } = usePoListQuery();

  const value = {
    content: data?.content ?? [],
    page:
      data?.page ??
      /** @type {PageMetaData} */ ({
        number: 1,
        size: 10,
        totalElements: 0,
        totalPages: 1,
      }),
    summary:
      data?.summary ?? { orderKinds: 0, totalCount: 0, totalPrice: 0 },
    isFetching,
  };

  return (
    <PoListContext.Provider value={value}>
      {children}
    </PoListContext.Provider>
  );
};
