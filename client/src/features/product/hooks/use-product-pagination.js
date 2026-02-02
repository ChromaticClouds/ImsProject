// @ts-check

import { MOCK_PRODUCTS } from '@/constants';
import { useMemo } from 'react';
import { useState } from 'react';

const ITEMS_PER_PAGE = 5;

export const useProductPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    소주: true,
    전통주: true,
    양주: true,
    고량주: true,
    위스키: true,
  });

  const createBrandState = (products) => {
    return products.reduce((acc, product) => {
      acc[product.brand] = true;
      return acc;
    }, {});
  };

  const [brandState, setBrandState] = useState(() =>
    createBrandState(MOCK_PRODUCTS),
  );

  const filteredList = useMemo(() => {
    return MOCK_PRODUCTS.filter(
      (item) => filters[item.category] && brandState[item.brand],
    );
  }, [filters, brandState]);

  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredList.slice(startIndex, endIndex);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

  const setAllBrands = (value) => {
    setBrandState((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, value])),
    );
  };

  return {
    setCurrentPage,
    setFilters,
    setBrandState,
    setAllBrands,
    currentPage,
    paginatedList,
    totalPages,
    filters,
    brandState,
    filteredList
  };
};
