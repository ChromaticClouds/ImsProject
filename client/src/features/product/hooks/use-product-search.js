// @ts-check

import { useQuery } from '@tanstack/react-query';
import { useProductSearchStore } from '../stores/use-product-search-store.js';
import { searchProducts } from '../api/product.js';

export const useProductSearch = () => {
  const keyword = useProductSearchStore((s) => s.keyword);

  return useQuery({
    queryKey: ['product-suggest', keyword],
    queryFn: () => searchProducts(keyword),
    staleTime: 0,
  });
};
