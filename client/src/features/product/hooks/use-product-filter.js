import { useMemo, useState } from 'react';

export const useProductFilter = (products) => {
  const [filters, setFilters] = useState({
    소주: true,
    전통주: true,
    양주: true,
    고량주: true,
    위스키: true,
  });

  const [brandState, setBrandState] = useState(() =>
    products.reduce((acc, p) => {
      acc[p.brand] = true;
      return acc;
    }, {})
  );

  const filteredList = useMemo(() => {
    return products.filter(
      (item) => filters[item.category] && brandState[item.brand]
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
