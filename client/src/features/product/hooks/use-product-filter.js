// @ts-check

import { useEffect } from 'react';
import { useMemo, useState } from 'react';

export const useProductFilter = (products) => {
  const [filters, setFilters] = useState({
    SOJU: true,
    BEER: true,
    WHISKY: true,
    고량주: true,
    위스키: true,
  });

  // const [brandState, setBrandState] = useState(() =>
  //   products.reduce((acc, p) => {
  //     acc[p.brand] = true;
  //     return acc;
  //   }, {})
  // );

  const [brandState, setBrandState] = useState({});

  useEffect(() => {
    if (products.length === 0) return;

    const initialBrandState = products.reduce((acc, p) => {
      acc[p.brand] = true;
      return acc;
    }, {});

    setBrandState(initialBrandState);
  }, [products]);


  const filteredList = useMemo(() => {
    return products.filter(
      (item) => {
        return filters[item.type] && brandState[item.brand]
      }
    );
  }, [products, filters, brandState]);

  const setAllBrands = (value) => {
    setBrandState((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, value]))
    );
  };

  return {
    filters,
    setFilters,
    brandState,
    setBrandState,
    setAllBrands,
    filteredList,
  };
};
