// @ts-check

import { useQuery } from '@tanstack/react-query';
import { useProductSearchStore } from '../stores/use-product-search-store.js';
import { searchProducts } from '../api/product.js';
import { useDebounce } from '@/hooks/use-debounce.js';
import { useState } from 'react';

// export const useProductSearch = () => {
//   const keyword = useProductSearchStore((s) => s.keyword);
//   const debounced = useDebounce(keyword, 400);

//   return useQuery({
//     queryKey: ['product-suggest', debounced],
//     queryFn: () => searchProducts(debounced),
//     staleTime: 0,
//   });
// };



export const useProductSearch = () => {
  const [keyword, setKeyword] = useState('');

  const applySearch = (list) => {
    if (!keyword.trim()) return list;

    const k = keyword.trim().toLowerCase();

    return list.filter((p) => {
      const name = String(p?.name ?? '').toLowerCase();
      const brand = String(p?.brand ?? '').toLowerCase();
      const code = String(p?.productCode ?? '').toLowerCase();

      return name.includes(k) || brand.includes(k) || code.includes(k);
    });
  };

  return { keyword, setKeyword, applySearch };
};
