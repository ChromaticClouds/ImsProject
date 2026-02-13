// @ts-check

import { useQuery } from '@tanstack/react-query';
import { poBootstrap } from '../api/index.js';

export const usePoBootstrapQuery = () => {
  return useQuery({
    queryKey: ['purchase', 'order', 'bootstrap'],
    queryFn: async () => {
      const response = await poBootstrap();
      return response?.data;
    },
  });
};
