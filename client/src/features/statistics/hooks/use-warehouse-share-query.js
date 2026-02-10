// @ts-check

import { useQuery } from '@tanstack/react-query';
import { getWarehouseShare } from '../api/index.js';

export const useWarehouseShareQuery = () =>
  useQuery({
    queryKey: ['stats', 'warehouse', 'share'],
    queryFn: async () => {
      const res = await getWarehouseShare();
      return res.data;
    },
  });
