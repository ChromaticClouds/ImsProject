// @ts-check

import { useFetchReceiveOrder } from '@/features/receive-order/hooks/use-fetch-receive-order.js';
import { useContext } from 'react';
import { createContext } from 'react';
import { useSearchParams } from 'react-router-dom';


/** @type {React.Context<null | PageResponse<ReceiveOrder>>} */
const RoListContext = createContext(null);

export const useRoListContext = () => {
  const ctx = useContext(RoListContext);
  if (!ctx) throw new Error('RoListContext is not provided');
  return ctx;
};

/** @param {React.PropsWithChildren} props */
export const RoListProvider = ({ children }) => {
  const [params] = useSearchParams();

  const page = Number(params.get('page') ?? 1) || 1;

  const pageResponse = useFetchReceiveOrder(page);

  return (
    <RoListContext.Provider value={{ ...pageResponse }}>
      {children}
    </RoListContext.Provider>
  )
};
