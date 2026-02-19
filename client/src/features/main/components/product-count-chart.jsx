// @ts-check
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, Tooltip, XAxis, YAxis, Cell, CartesianGrid } from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile.js';
import { ChartContainer } from '@/components/ui/chart.js';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

  const [type, setType] = useState('ALL');
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


const BAR_WIDTH = 32;   
const GAP = isMobile ? 16 : 32;         
const chartWidth = data.length * (BAR_WIDTH + GAP);

// const BAR_SIZE = isMobile ? 10 : 18;
// const CATEGORY_PX = isMobile ? 26 : 34;
// const chartWidth = Math.max(900, data.length * CATEGORY_PX);



  return (
    <div className="flex h-full flex-col">
      {/* 필터바 */}
      <div className="flex flex-wrap items-center gap-3 pb-3">
<Select value={type} onValueChange={setType}>
  <SelectTrigger className="h-9 w-40">
    <SelectValue placeholder="전체" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="ALL">전체</SelectItem>
    {(typesQ.data ?? []).map((t) => (
      <SelectItem key={t} value={t}>
        {TYPE_LABEL[t] ?? t}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


          <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
            <Checkbox
              id="unsafeOnly"
              checked={unsafeOnly}
              onCheckedChange={(v) => setUnsafeOnly(v === true)}
            />
          <label
            htmlFor="unsafeOnly"
            className="cursor-pointer select-none text-sm font-medium"
          >
            안전재고 미만
          </label>
        </div>

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
            <ChartContainer config={chartConfig} className="h-70 w-full">
              <BarChart data={data} barSize={BAR_WIDTH} barCategoryGap={GAP}>
                <CartesianGrid vertical={false} />

                <XAxis
                  dataKey="productName"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  height={isMobile ? 70 : 100}
                  angle={-45}
                  textAnchor="end"
                  tickMargin={10}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(v) =>
                    String(v).length > 12 ? `${String(v).slice(0, 12)}…` : v
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
