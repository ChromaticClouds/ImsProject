// @ts-check
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
} from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile.js';
import { ChartContainer } from '@/components/ui/chart.js';
import { Checkbox } from '@/components/ui/checkbox';

import {
  fetchStatisticsTypes,
  fetchStatisticsStockByProduct,
} from '@/features/statistics/api/index.js';
import { ChartLoading } from '@/features/statistics/components/chart-loading.jsx';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { Button } from '@/components/ui/button.js';
import { ChevronDownIcon } from 'lucide-react';
import { CheckIcon } from 'lucide-react';

const chartConfig =
  /** @type {import('@/components/ui/chart.js').ChartConfig} */ ({
    stock: { label: '현재고' },
  });

/** @param {{ active?: boolean, payload?: any[] }} props */
const StockTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className='rounded-md border bg-background px-3 py-2 text-sm shadow-md'>
      <div className='font-semibold'>{d.productName}</div>
      <div className='mt-1 flex flex-col gap-1'>
        <div>
          현재고: <b>{Number(d.stockCount ?? 0).toLocaleString()}</b>
        </div>
        <div>
          안전재고: <b>{Number(d.safetyStock ?? 0).toLocaleString()}</b>
        </div>
      </div>
    </div>
  );
};

const TYPE_LABEL = {
  WHISKEY: '위스키',
  SOJU: '소주',
  TRADITIONAL: '전통주',
  LIQUOR: '양주',
  KAOLIANG_LIQUOR: '고량주',
};

export const ProductCountChart = () => {
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

  const rows = useMemo(
    () => (Array.isArray(stockQ.data) ? stockQ.data : []),
    [stockQ.data],
  );

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
  const GAP = isMobile ? 16 : 32;
  const chartWidth = data.length * (BAR_WIDTH + GAP * 4);

  return (
    <div className='flex h-full flex-col'>
      {/* 필터바 */}
      <div className='flex flex-wrap items-center gap-3 pb-3'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='w-40 flex justify-between items-center'
            >
              {type ? TYPE_LABEL[type] : '전체'}
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-40'>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setType('');
                }}
              >
                <span className='truncate'>전체</span>
                {!type && <CheckIcon className='h-4 w-4 opacity-70 ml-auto' />}
              </DropdownMenuItem>
              {(typesQ.data ?? []).map((t) => (
                <DropdownMenuItem
                  key={t}
                  onSelect={(e) => {
                    e.preventDefault();
                    setType(t);
                  }}
                >
                  <span className='truncate'>{TYPE_LABEL[t] ?? t}</span>
                  {type === t && (
                    <CheckIcon className='h-4 w-4 opacity-70 ml-auto' />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <label className='flex items-center gap-2 text-sm'>
          <Checkbox
            checked={unsafeOnly}
            onCheckedChange={(e) => setUnsafeOnly(!!e)}
            className='h-4 w-4 rounded border'
          />
          안전재고 미만
        </label>

        {stockQ.isFetching ? (
          <span className='text-sm text-muted-foreground'>불러오는 중...</span>
        ) : null}
      </div>

      {stockQ.isFetching ? (
        <ChartLoading />
      ) : (
        <div className='w-full flex-1 overflow-x-auto'>
          <div
            style={{ minWidth: chartWidth }}
            className='w-full h-full flex items-end'
          >
            {data.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className='h-60 w-full'
              >
                <BarChart
                  data={data}
                  barSize={BAR_WIDTH}
                  barCategoryGap={GAP}
                >
                  <CartesianGrid vertical={false} />

                  {!isMobile && (
                    <XAxis
                      dataKey='productName'
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      textAnchor='middle'
                      height={30}
                      tickFormatter={(v) =>
                        String(v).length > 10 ? `${String(v).slice(0, 10)}…` : v
                      }
                    />
                  )}

                  {!isMobile && (
                    <YAxis
                      width={30}
                      tickLine={false}
                      axisLine={false}
                    />
                  )}

                  <Tooltip content={<StockTooltip />} />

                  <Bar
                    dataKey='stockCount'
                    radius={[8, 8, 0, 0]}
                  >
                    {data.map((entry) => (
                      <Cell
                        key={entry.productId}
                        fill={
                          entry.isLow
                            ? 'var(--color-destructive)'
                            : 'var(--chart-3)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className='w-full h-full rounded-lg border-dashed border-3 flex items-center justify-center'>
                <span className='text-muted-foreground text-sm'>
                  데이터가 없습니다
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
