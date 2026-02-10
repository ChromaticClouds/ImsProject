// @ts-check
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { GraphContainer } from './graph-container.jsx';
import { ClientRankChart } from './client-rank-chart.jsx';
import { StatisticsDateRangePicker } from './statistics-date-range-picker.jsx';

import {
  fetchInboundPartnerRank,
  fetchOutboundPartnerRank,
} from '../api/index.js';

function toYmd(d) {
  return d.toISOString().slice(0, 10);
}

export const ClientRank = () => {
  const today = new Date();
  const sixMonthsAgo = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d;
  }, []);

  const [range, setRange] = useState({
    from: toYmd(sixMonthsAgo),
    to: toYmd(today),
  });

  /** @type {[('inbound'|'outbound'), import('react').Dispatch<import('react').SetStateAction<('inbound'|'outbound')>>]} */
  const [mode, setMode] = useState('inbound'); // inbound | outbound

  const query = useQuery({
    queryKey: ['partner-rank', range, mode],
    enabled: !!range.from && !!range.to,
    queryFn: () =>
      mode === 'inbound'
        ? fetchInboundPartnerRank({ ...range, limit: 5 })
        : fetchOutboundPartnerRank({ ...range, limit: 5 }),
  });

  const chartData = (query.data ?? []).map((r) => ({
    partner: r.name,
    qty: r.qty,
  }));

  return (
    <GraphContainer
      title="거래처 순위 통계"
      description="TOP 5 거래처 입출고 순위"
      width="third"
      height="lg"
    >
      {/* 필터 영역 */}
      <div className="flex items-end gap-3 mb-3 flex-wrap">
        <StatisticsDateRangePicker value={range} onChange={setRange} disabled={false} minDateYMD={undefined} />

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value === 'inbound' ? 'inbound' : 'outbound')}
          className="h-9 rounded-md border px-2"
        >
          <option value="inbound">공급처</option>
          <option value="outbound">판매처</option>
        </select>
      </div>

      {query.isFetching ? (
        <div className="text-sm text-muted-foreground">데이터 불러오는 중...</div>
      ) : (
        <ClientRankChart data={chartData} mode={mode} />
      )}
    </GraphContainer>
  );
};

