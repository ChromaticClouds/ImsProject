// @ts-check

import { useQuery } from '@tanstack/react-query';
import { getProductShare } from '../api/index.js';

export const useProductShareQuery = () =>
  useQuery({
    queryKey: ['stats', 'product', 'share'],
    queryFn: async () => {
      const res = await getProductShare();
      return res.data; // ApiResponse 구조일 경우
    },
  });
