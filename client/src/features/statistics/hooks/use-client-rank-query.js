// @ts-check

/**
 * Hooks
 */
import { useClientRankStore } from '@/features/statistics/stores/use-client-rank-store.js';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';

/**
 * Api
 */
import {
  fetchInboundPartnerRank,
  fetchOutboundPartnerRank,
} from '@/features/statistics/api/index.js';
import { useMemo } from 'react';

export const useClientRankQuery = () => {
  const [range, mode] = useClientRankStore(
    useShallow((s) => [s.range, s.mode]),
  );

  const query = useQuery({
    queryKey: ['partner-rank', range.from, range.to, mode],
    enabled: !!range.from && !!range.to,
    queryFn: () =>
      mode === 'inbound'
        ? fetchInboundPartnerRank({ ...range, limit: 5 })
        : fetchOutboundPartnerRank({ ...range, limit: 5 }),
  });

  const chartData = useMemo(
    () => (query.data ?? []).map((r) => ({ partner: r.name, qty: r.qty })),
    [query.data],
  );

  return { range, mode, ...query, chartData };
};
