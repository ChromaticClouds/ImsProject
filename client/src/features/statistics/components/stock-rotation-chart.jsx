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

export const StockRotationChart = () => {
  return (
    <ChartContainer config={turnoverTrendConfig} className="h-80 w-full">
      <LineChart data={inventoryTurnoverTrendMock}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="period" />
        <YAxis />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Line
          type="monotone"
          dataKey="turnover"
          strokeWidth={2}
          dot
          />
      </LineChart>
    </ChartContainer>
  );
};
