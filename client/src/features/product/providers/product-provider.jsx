// @ts-check

import { createContext } from 'react';
import { useProductQuery } from '@/features/product/hooks/use-product-query.js';
import { useContext } from 'react';

/**
 * @type {React.Context<ReturnType<typeof useProductQuery>>}
 */
const ProductContext = createContext(null);

export const useProductContext = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) new Error('Product Context is not provived');
  return ctx;
}

/**
 * @param {React.PropsWithChildren} children
 */
export const ProductProvider = ({ children }) => {
  const { content, pageResponse } = useProductQuery();

  return (
    <ProductContext.Provider value={{ content, pageResponse }}>
      {children}
    </ProductContext.Provider>
  )
};
