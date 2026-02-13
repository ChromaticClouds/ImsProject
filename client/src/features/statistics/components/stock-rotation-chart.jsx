// @ts-check

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { inventoryTurnoverTrendMock } from '../constants/index.js';

export const turnoverTrendConfig = {
  turnover: {
    label: '재고 회전율',
  },
};

/**
 * 재고 회전율 차트
 */
export const StockRotationChart = () => {
  return (
    <ChartContainer config={turnoverTrendConfig} className="h-80 w-full">
      <LineChart data={inventoryTurnoverTrendMock} >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="period" />
        <YAxis />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Line
          type="monotone"
          dataKey="turnover"
          strokeWidth={2}
          stroke='var(--chart-4)'
          fill='var(--chart-4)'
          dot
          />
      </LineChart>
    </ChartContainer>
  );
};
