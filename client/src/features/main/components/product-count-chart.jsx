// @ts-check
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, Tooltip, XAxis, YAxis, Cell, CartesianGrid } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile.js';
import { ChartContainer } from '@/components/ui/chart.js';

import {
  fetchStatisticsTypes,
  fetchStatisticsStockByProduct,
} from '@/features/statistics/api/index.js';

const chartConfig =
  /** @type {import('@/components/ui/chart.js').ChartConfig} */ ({
    stock: { label: '현재고' },
  });

/** @param {{ active?: boolean, payload?: any[] }} props */
function StockTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-md">
      <div className="font-semibold">{d.productName}</div>
      <div className="mt-1 flex flex-col gap-1">
        <div>
          현재고: <b>{Number(d.stockCount ?? 0).toLocaleString()}</b>
        </div>
        <div>
          안전재고: <b>{Number(d.safetyStock ?? 0).toLocaleString()}</b>
        </div>
      </div>
    </div>
  );
}

export const ProductCountChart = () => {

  const TYPE_LABEL = {
  WHISKEY: '위스키',
  SOJU: '소주',
  TRADITIONAL: '전통주',
  LIQUOR: '양주',
  KAOLIANG_LIQUOR: '고량주',
};

  const isMobile = useIsMobile();

  const [type, setType] = useState('');
  const [unsafeOnly, setUnsafeOnly] = useState(false);

  const typesQ = useQuery({
    queryKey: ['stats-types'],
    queryFn: fetchStatisticsTypes,
    staleTime: 60_000,
  });

  const stockQ = useQuery({
    queryKey: ['stats-stock-by-product', { type, unsafeOnly }],
    queryFn: () =>
      fetchStatisticsStockByProduct({
        type: type || undefined,
        unsafeOnly,
        limit: 500,
      }),
  });

  const rows = useMemo(() => (Array.isArray(stockQ.data) ? stockQ.data : []), [stockQ.data]);

  const data = useMemo(() => {
    return rows.map((r) => {
      const stock = Number(r.stockCount ?? 0);
      const safety = Number(r.safetyStock ?? 0);
      return {
        productId: r.productId,
        productName: r.productName ?? '-',
        stockCount: stock,
        safetyStock: safety,
        isLow: stock < safety,
      };
    });
  }, [rows]);


const BAR_WIDTH = isMobile ? 14 : 30;   
const GAP = isMobile ? 80 : 180;         
const chartWidth = Math.max(1300, data.length * (BAR_WIDTH + GAP));

  return (
    <div className="flex h-full flex-col">
      {/* 필터바 */}
      <div className="flex flex-wrap items-center gap-3 pb-3">
        <select
  value={type}
  onChange={(e) => setType(e.target.value)}
  className="h-9 w-40 rounded-md border px-2"
>
  <option value="">전체</option>
  {(typesQ.data ?? []).map((t) => (
    <option key={t} value={t}>
      {TYPE_LABEL[t] ?? t}
    </option>
  ))}
</select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={unsafeOnly}
            onChange={(e) => setUnsafeOnly(e.target.checked)}
            className="h-4 w-4 rounded border"
          />
          안전재고 미만
        </label>

        {stockQ.isFetching ? (
          <span className="text-sm text-muted-foreground">불러오는 중...</span>
        ) : null}
      </div>

      {stockQ.isError ? (
        <div className="text-sm text-red-600">재고 통계 조회 실패 (Network/서버 로그 확인)</div>
      ) : data.length === 0 ? (
        <div className="text-sm text-muted-foreground">표시할 데이터가 없습니다.</div>
      ) : (
        <div className="w-full flex-1 overflow-x-auto">
          <div style={{ minWidth: chartWidth }}>
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <BarChart data={data} barSize={BAR_WIDTH} barCategoryGap={GAP}>
                <CartesianGrid vertical={false} />

                <XAxis
                  dataKey="productName"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  
                  textAnchor="end"
                  height={80}
                  tickMargin={5}
                  tickFormatter={(v) =>
                    String(v).length > 15 ? `${String(v).slice(0, 15)}…` : v
                  }
                />

                {!isMobile && <YAxis tickLine={false} axisLine={false} />}

                <Tooltip content={<StockTooltip />} />

                <Bar dataKey="stockCount" radius={[8, 8, 0, 0]}>
                  {data.map((entry) => (
                    <Cell
                      key={entry.productId}
                      fill={entry.isLow ? 'hsl(var(--destructive))' : 'var(--chart-3)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      )}
    </div>
  );
};
