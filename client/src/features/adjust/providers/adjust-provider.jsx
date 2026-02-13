// @ts-check

import { useContext } from 'react';
import { createContext } from 'react';
import { useAdjustForm } from '../hooks/use-adjust-form.js';
import { useAdjustProductList } from '../hooks/use-adjust-product-list.js';

/**
 * @type {React.Context<{ form: ReturnType<typeof useAdjustForm>, products: ProductSuggest[] }>}
 */
const AdjustContext = createContext(null);

export const useAdjustContext = () => {
  const ctx = useContext(AdjustContext);
  if (!ctx) throw new Error('AdjustContext is not provided');
  return ctx;
};

/**
 * @param {React.PropsWithChildren} props
 */
export const AdjustProvider = ({ children }) => {
  const form = useAdjustForm();
  const { data } = useAdjustProductList();

  const products = data?.data;

  return (
    <AdjustContext.Provider value={{ form, products }}>
      {children}
    </AdjustContext.Provider>
  );
};
