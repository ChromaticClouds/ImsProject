// @ts-check

import { createContext } from 'react';
import { useProductQuery } from '../hooks/use-product-query.js';
import { useContext } from 'react';

/**
 * @type {React.Context<ReturnType<typeof useProductQuery>>}
 */
const ProductContext = createContext(null);

export const useProductContext = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) new Error('Product Context not provided');
  return ctx;
};

/**
 * 품목 검색 쿼리 패치 결과 프로바이더
 * @param {React.PropsWithChildren} props
 * @returns {React.JSX.Element}
 */
export const ProductProvider = ({ children }) => {
  const { content, pageResponse } = useProductQuery();

  return (
    <ProductContext.Provider value={{ content, pageResponse }}>
      {children}
    </ProductContext.Provider>
  );
};
