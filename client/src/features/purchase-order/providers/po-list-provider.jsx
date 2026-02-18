// @ts-check

import { usePoListQuery } from '@/features/purchase-order/hooks/use-po-list-query.js';
import { useContext } from 'react';
import { createContext } from 'react';

/**
 * @import { Context } from 'react'
 */

/** @type {Context<OrderResponse & { isFetching: boolean }>} */
const PoListContext = createContext(null);

export const usePoListContext = () => {
  const ctx = useContext(PoListContext);
  if (!ctx) throw new Error('PoListContext is not provided');
  return ctx;
};

export const PoListProvider = ({ children }) => {
  const { data, isFetching } = usePoListQuery();

  return (
    <PoListContext.Provider value={{ ...data, isFetching }}>
      {children}
    </PoListContext.Provider>
  );
};
