// @ts-check

import { createContext } from 'react';

/**
 * Hooks
 */
import { useFetchOutbound } from '../hooks/use-fetch-outbound.js';
import { useContext } from 'react';
import { useState } from 'react';

/** @type {React.Context<{ managers: UserIdentifier[] }>} */
const TableContext = createContext(null);

export const useOutboundManagersContext = () => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('Table context is not provided');
  return ctx;
};

export const ReceiveOrderTableProvider = ({ children }) => {
  const { data } = useFetchOutbound();

  const managers = data?.data ?? [];

  return (
    <TableContext.Provider value={{ managers }}>
      {children}
    </TableContext.Provider>
  );
};
