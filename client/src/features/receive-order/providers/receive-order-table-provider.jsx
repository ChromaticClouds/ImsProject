// @ts-check

import { createContext } from 'react';

/**
 * Hooks
 */
import { useFetchOutbound } from '../hooks/use-fetch-outbound.js';
import { useContext } from 'react';

const TableContext = createContext(
  /** @type {{ managers: UserIdentifier[] } | null} */ (null),
);

export const useOutboundManagersContext = () => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('Table context is not provided');
  return ctx;
};

/** @param {React.PropsWithChildren} props */
export const ReceiveOrderTableProvider = ({ children }) => {
  const { data } = useFetchOutbound();

  const managers = data?.data ?? [];

  return (
    <TableContext.Provider value={{ managers }}>
      {children}
    </TableContext.Provider>
  );
};
