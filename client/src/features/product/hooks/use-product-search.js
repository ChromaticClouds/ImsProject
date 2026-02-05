// @ts-check

import { useQuery } from '@tanstack/react-query';
import { useProductSearchStore } from '../stores/use-product-search-store.js';
import { searchProducts } from '../api/product.js';
import { useDebounce } from '@/hooks/use-debounce.js';

export const useProductSearch = () => {
  const keyword = useProductSearchStore((s) => s.keyword);
  const debounced = useDebounce(keyword, 400);

  return useQuery({
    queryKey: ['product-suggest', debounced],
    queryFn: () => searchProducts(debounced),
    staleTime: 0,
  });
};
