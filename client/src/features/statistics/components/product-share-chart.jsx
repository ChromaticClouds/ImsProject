// @ts-check

import { PieChart, Pie, Cell } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { useProductShareQuery } from '../hooks/use-product-share-query.js';
import { ChartLoading } from './chart-loading.jsx';

export const stockShareConfig = {
  stock: {
    label: '재고 수량',
  },
};

/**
 * 각 품목 당 재고 점유율 차트
 */
export const ProductShareChart = () => {
  const { data, isLoading, isError } = useProductShareQuery();

  if (isLoading) return <ChartLoading />;
  if (isError || !data) return null;

  const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ];

  const chartData = data.map((item, index) => ({
    item: item.item,
    stock: item.stock,
    fill: COLORS[index % COLORS.length],
  }));

  const totalStock = chartData.reduce((sum, v) => sum + v.stock, 0);

  return (
    <ChartContainer
      config={stockShareConfig}
      className='h-80 w-full'
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />

        <Pie
          data={chartData}
          dataKey='stock'
          nameKey='item'
          innerRadius={70}
          outerRadius={110}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.fill}
            />
          ))}
        </Pie>

        <text
          x='50%'
          y='48%'
          textAnchor='middle'
          dominantBaseline='middle'
          className='text-2xl font-bold fill-foreground'
        >
          {totalStock}
        </text>

        <text
          x='50%'
          y='58%'
          textAnchor='middle'
          dominantBaseline='middle'
          className='text-sm fill-muted-foreground'
        >
          총 품목 수
        </text>
      </PieChart>
    </ChartContainer>
  );
};

