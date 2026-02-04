import { PieChart, Pie, Cell } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { stockShareMock } from '../constants/index.js';

export const stockShareConfig = {
  stock: {
    label: '재고 수량',
  },
};

const totalStock = stockShareMock.reduce((sum, v) => sum + v.stock, 0);

export const StockShareChart = () => {
  return (
    <ChartContainer
      config={stockShareConfig}
      className='h-80 w-full'
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />

        <Pie
          data={stockShareMock}
          dataKey='stock'
          nameKey='item'
          innerRadius={70} // ← 도넛 형태
          outerRadius={110}
          paddingAngle={3}
        >
          {stockShareMock.map((_, index) => (
            <Cell key={index} />
          ))}
        </Pie>

        <text
          x='50%'
          y='50%'
          textAnchor='middle'
          dominantBaseline='middle'
          className='text-2xl font-bold fill-foreground'
        >
          {totalStock}
        </text>
      </PieChart>
    </ChartContainer>
  );
};
