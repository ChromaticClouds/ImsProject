import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchStatisticsInOutByProduct } from '@/features/statistics/api/index.js';
import { useDebounce } from '@/hooks/use-debounce.js';
import {
  getDefaultInOutBoundDateRange,
  getInOutBoundDateError,
} from '@/features/statistics/utils/in-out-bound-date.js';

const ALL = 'ALL';

type AllValue = typeof ALL;
type InOutBoundTypeFilter = ProductType | AllValue;
type InOutBoundBrandFilter = string | AllValue;

const normalizeFilterValue = (value: string) => {
  return value && value !== ALL ? value : undefined;
};

export const useInOutBoundStatistics = () => {
  const defaultRange = useMemo(() => getDefaultInOutBoundDateRange(), []);

  const [from, setFrom] = useState(defaultRange.from);
  const [to, setTo] = useState(defaultRange.to);
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState<InOutBoundTypeFilter>(ALL);
  const [brand, setBrand] = useState<InOutBoundBrandFilter>(ALL);

  const debouncedKeyword = useDebounce(keyword);
  const dateError = useMemo(() => getInOutBoundDateError(from, to), [from, to]);

  const setTypeFilter: Dispatch<SetStateAction<InOutBoundTypeFilter>> = (
    nextType,
  ) => {
    setType((prevType) => {
      const resolvedType =
        typeof nextType === 'function' ? nextType(prevType) : nextType;

      setBrand(ALL);
      return resolvedType;
    });
  };

  const query = useQuery({
    queryKey: ['stats-inout', { from, to, debouncedKeyword, type, brand }],
    enabled: Boolean(from && to && !dateError),
    queryFn: () =>
      fetchStatisticsInOutByProduct({
        from,
        to,
        keyword: debouncedKeyword || undefined,
        type: normalizeFilterValue(type),
        brand: normalizeFilterValue(brand),
        limit: 300,
      }),
  });

  const chartData = useMemo(() => {
    const rows = Array.isArray(query.data) ? query.data : [];

    return rows.map((r) => ({
      item: r.productName ?? '-',
      inbound: Number(r.inboundQty ?? 0),
      outbound: Number(r.outboundQty ?? 0),
      total: Number(r.totalQty ?? 0),
    }));
  }, [query.data]);

  return {
    filters: {
      from,
      to,
      keyword,
      type,
      brand,
    },
    actions: {
      setFrom,
      setTo,
      setKeyword,
      setType: setTypeFilter,
      setBrand,
    },
    dateError,
    query,
    chartData,
  };
};
