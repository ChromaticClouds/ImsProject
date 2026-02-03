// hooks/use-product-search.js
import { useState } from 'react';

export const useProductSearch = () => {
  const [keyword, setKeyword] = useState('');

  const applySearch = (list) => {
    if (!keyword.trim()) return list;

    const lower = keyword.toLowerCase();

    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.code.toLowerCase().includes(lower) ||
        item.brand.toLowerCase().includes(lower)
    );
  };

  return {
    keyword,
    setKeyword,
    applySearch,
  };
};
