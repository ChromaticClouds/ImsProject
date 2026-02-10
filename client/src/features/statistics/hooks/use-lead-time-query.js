import { useQuery } from '@tanstack/react-query';
import { getProductLeadTime, getVendorLeadTime } from '../api/index.js';

/**
 * @param {'vendor' | 'product'} type 
 */
export const useLeadTimeQuery = (type) =>
  useQuery({
    queryKey: ['stats', 'lead-time', type],
    queryFn: async () => {
      const res =
        type === 'vendor'
          ? await getVendorLeadTime()
          : await getProductLeadTime();

      return res?.data ?? [];
    },
  });
