// @ts-check

import { createContext } from 'react';
import { useProductQuery } from '../hooks/use-product-query.js';
import { useContext } from 'react';

const ProductContext = createContext(
  /** @type {ReturnType<typeof useProductQuery> | null} */ (null),
);

export const useProductContext = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('Product Context not provided');
  return ctx;
};

/**
 * 품목 검색 쿼리 패치 결과 프로바이더
 * @param {React.PropsWithChildren} props
 * @returns {React.JSX.Element}
 */
export const ProductProvider = ({ children }) => {
  const { content, pageResponse, isFetching } = useProductQuery();

  return (
    <ProductContext.Provider value={{ content, pageResponse, isFetching }}>
      {children}
    </ProductContext.Provider>
  );
};
