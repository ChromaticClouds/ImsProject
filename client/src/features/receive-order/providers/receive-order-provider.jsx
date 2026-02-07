// @ts-check

import { useOrderCategory } from "@/features/receive-order/hooks/use-order-category.js";
import { useContext } from "react";
import { createContext } from "react"

/**
 * @typedef {object} ReceiveOrderCategoryType
 * @property {string[]} users
 * @property {string[]} sellers
 */

/**
 * @type {React.Context<ReceiveOrderCategoryType>}
 */
const ReceiveOrderContext = createContext(null);

export const useReceiveOrderContext = () => {
  const ctx = useContext(ReceiveOrderContext);
  if (ctx) throw new Error('Receive order context is not provived');
  return ctx;
}

/**
 * @param {React.PropsWithChildren} props 
 */
export const ReceiveOrderProvider = ({ children }) => {
  const { data } = useOrderCategory();

  const { users = [], sellers = [] } = data?.data;

  return (
    <ReceiveOrderContext.Provider value={{ users, sellers }}>
      {children}
    </ReceiveOrderContext.Provider>
  )
}