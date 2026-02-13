// @ts-check

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getSuggetedProducts } from '../api/index.js';

export const useAdjustProductList = () => {
  const [params] = useSearchParams();

  const search = params.get('search') ?? '';

  return useQuery({
    queryKey: ['adjust-products', search],
    queryFn: () => getSuggetedProducts(search),
  });
};
