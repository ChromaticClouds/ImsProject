import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/index.js';

/**
 * @param {SearchCondition} condition 
 */
export const useProductView = (condition) => {
  return useQuery({
    queryKey: ['products', condition],
    queryFn: () => fetchProducts(condition),
  });
};
