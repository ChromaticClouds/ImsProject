import { useMemo } from 'react';

/**
 * @param {import("@/features/vendor/types/index.js").VendorProductType[]} items
 */
export const usePriceSummary = (items) => {
  return useMemo(() => {
    if (items.length === 0) return { minPrice: null, maxPrice: null };

    let min = Infinity;
    let max = -Infinity;

    for (const item of items) {
      const price = Number(item.purchasePrice ?? 0);
      if (price < min) min = price;
      if (price > max) max = price;
    }

    return { minPrice: min, maxPrice: max };
  });
};
