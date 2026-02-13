// @ts-check

import { BarChart, Bar, XAxis, CartesianGrid } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

import { inboundOutboundByItemMock } from '../constants/index.js';
import { useIsMobile } from '@/hooks/use-mobile.js';

// chart-config.js
export const inboundOutboundConfig = {
  inbound: {
    label: '입고',
    color: 'hsl(var(--chart-1))',
  },
  outbound: {
    label: '출고',
    color: 'hsl(var(--chart-2))',
  },
};

/**
 * 입출고 수량 합계 통계 차트
 */
export const InOutboundChart = () => {
  const isMobile = useIsMobile();

  const BAR_WIDTH = 32;
  const GAP = isMobile ? 16 : 32;
  const chartWidth = inboundOutboundByItemMock.length * (BAR_WIDTH + GAP);

  return (
    <ChartContainer
      config={inboundOutboundConfig}
      className='h-80 w-full'
      style={{ minWidth: chartWidth }}
    >
      <BarChart
        data={inboundOutboundByItemMock}
        barSize={isMobile ? 12 : 24}
        barCategoryGap={16}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='item'
          tickLine={false}
          axisLine={false}
        />

        <ChartTooltip content={<ChartTooltipContent />} />
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
  );
};
