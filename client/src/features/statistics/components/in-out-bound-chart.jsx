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

export const inboundOutboundConfig = {
  inbound: { label: '입고', color: 'hsl(var(--chart-1))' },
  outbound: { label: '출고', color: 'hsl(var(--chart-2))' },
};

/**
 * @param {{ data: Array<{ item: string, inbound: number, outbound: number, total: number }> }} props
 */
export const InOutboundChart = ({ data }) => {
  const isMobile = useIsMobile();

  const BAR_WIDTH = 32;
  const GAP = isMobile ? 16 : 32;
  const chartWidth = Math.max(1, data.length) * (BAR_WIDTH + GAP);

  return (
    <div className='h-full flex items-center'>
      <ChartContainer
        config={inboundOutboundConfig}
        className='h-70 w-full'
        style={{ minWidth: chartWidth }}
      >
        <BarChart
          data={data}
          barSize={isMobile ? 12 : 24}
          barCategoryGap={16}
          margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='item'
            tickLine={false}
            axisLine={false}
          />

          <ChartTooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const p = payload?.[0]?.payload;
              return (
                <div className='rounded-md border bg-background p-2 text-sm shadow'>
                  <div className='font-semibold mb-1'>{label}</div>
                  <div className='flex flex-col gap-0.5'>
                    <div>입고: {Number(p?.inbound ?? 0).toLocaleString()}</div>
                    <div>출고: {Number(p?.outbound ?? 0).toLocaleString()}</div>
                    <div className='font-semibold'>
                      합계: {Number(p?.total ?? 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            }}
          />

          <ChartLegend content={<ChartLegendContent />} />

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
      </ChartContainer>
    </div>
  );
};
