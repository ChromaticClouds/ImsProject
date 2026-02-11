// @ts-check

import { useQuery } from '@tanstack/react-query';
import { getProductLeadTime, getVendorLeadTime } from '../api/index.js';
import { useLeadTimeFilterStore } from '../stores/use-lead-time-filter-store.js';

export const useLeadTimeQuery = () => {
  const searchType = useLeadTimeFilterStore((s) => s.filter.searchType);
  const startDate = useLeadTimeFilterStore((s) => s.filter.startDate);
  const endDate = useLeadTimeFilterStore((s) => s.filter.endDate);

  return useQuery({
    queryKey: ['stats', 'lead-time', searchType, startDate, endDate],

    queryFn: async () => {
      const params = { startDate, endDate };

      const res =
        searchType === 'vendor'
          ? await getVendorLeadTime(params)
          : await getProductLeadTime(params);

      return res?.data ?? [];
    },

    enabled: !!startDate && !!endDate,
  });
};
