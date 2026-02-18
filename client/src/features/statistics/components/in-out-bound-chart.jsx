// @ts-check
import React from 'react';
import { BarChart, Bar, XAxis, CartesianGrid } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

import { useIsMobile } from '@/hooks/use-mobile.js';
import { Spinner } from '@/components/ui/spinner.js';
import { ChartLoading } from '@/features/statistics/components/chart-loading.jsx';

export const inboundOutboundConfig = {
  inbound: { label: '입고', color: 'hsl(var(--chart-1))' },
  outbound: { label: '출고', color: 'hsl(var(--chart-2))' },
};

/** @param {string} label */
const formatter = (label) =>
  label.length > 10 ? label.slice(0, 10) + '...' : label;

/**
 * @param {{ data: Array<{ item: string, inbound: number, outbound: number, total: number }>, isFetching: boolean }} props
 */
export const InOutboundChart = ({ data, isFetching }) => {
  const isMobile = useIsMobile();

  const BAR_WIDTH = 32;
  const GAP = isMobile ? 16 : 32 * 3;
  const chartWidth = Math.max(1, data.length) * (BAR_WIDTH + GAP);

  return (
    <div className='h-full flex items-center overflow-x-auto justify-between'>
      <ChartContainer
        config={inboundOutboundConfig}
        className='h-58 w-full'
        style={{ minWidth: chartWidth }}
      >
        {isFetching ? (
          <ChartLoading />
        ) : (
          <BarChart
            data={data}
            barSize={isMobile ? 12 : 24}
            barCategoryGap={16}
            margin={{ top: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey='item'
              tickLine={false}
              axisLine={false}
              dy={0}
              height={isMobile ? 0 : 10}
              tick={!isMobile}
              tickFormatter={formatter}
            />

            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const p = payload?.[0]?.payload;
                return (
                  <div className='rounded-md border bg-background p-2 text-sm shadow'>
                    <div className='font-semibold mb-1'>{label}</div>
                    <div className='flex flex-col gap-0.5'>
                      <div>
                        입고: {Number(p?.inbound ?? 0).toLocaleString()}
                      </div>
                      <div>
                        출고: {Number(p?.outbound ?? 0).toLocaleString()}
                      </div>
                      <div className='font-semibold'>
                        합계: {Number(p?.total ?? 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            <Bar
              dataKey='inbound'
              fill='var(--chart-1)'
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey='outbound'
              fill='var(--chart-2)'
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        )}
      </ChartContainer>
    </div>
  );
};
