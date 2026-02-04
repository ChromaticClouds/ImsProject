// @ts-check

import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

import { inboundOutboundByItemMock } from '../constants/index.js';

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

export const InOutboundChart = () => {
  return (
    <ChartContainer config={inboundOutboundConfig} className="h-80 w-full">
      <BarChart data={inboundOutboundByItemMock}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="item"
          tickLine={false}
          axisLine={false}
        />

        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />

        <Bar
          dataKey="inbound"
          fill="var(--color-inbound)"
          radius={[6, 6, 0, 0]}
        />
        <Bar
          dataKey="outbound"
          fill="var(--color-outbound)"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};
