// @ts-check

import { createContext } from 'react';

/**
 * Hooks
 */
import { useContext } from 'react';
import { useOrderPostForm } from '../hooks/use-order-post-form.js';
import { useOrderBootstrap } from '../hooks/use-order-bootstrap.js';

/**
 * @typedef {ReturnType<typeof useOrderPostForm>} OrderPostForm
 */

/**
 * @type {React.Context<{ categories: OrderCategories, form: OrderPostForm, sequence: string }>}
 */
const ReceiveOrderPostContext = createContext(null);

export const useOrderPostContext = () => {
  const ctx = useContext(ReceiveOrderPostContext);
  if (!ctx) throw new Error('Receive order post context is not provived1');
  return ctx;
};

/**
 * @param {React.PropsWithChildren} props
 */
export const ReceiveOrderPostProvider = ({ children }) => {
  const form = useOrderPostForm();
  const { data, error } = useOrderBootstrap();

  console.log(data, error);

  const context = data?.data;

  const categories = {
    users: context?.users ?? [],
    sellers: context?.sellers ?? [],
  };

  return (
    <ReceiveOrderPostContext.Provider
      value={{ categories, form, sequence: context?.sequence ?? '' }}
    >
      {children}
    </ReceiveOrderPostContext.Provider>
  );
};
