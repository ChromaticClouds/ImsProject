// @ts-check

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart.js';
import { useIsMobile } from '@/hooks/use-mobile.js';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { product: '진로', stock: 90 },
  { product: '새로', stock: 110 },
  { product: '청풍', stock: 130 },
  { product: '빨뚜', stock: 100 },
  { product: '진로', stock: 90 },
  { product: '새로', stock: 110 },
  { product: '청풍', stock: 130 },
  { product: '빨뚜', stock: 100 },
  { product: '진로', stock: 90 },
  { product: '새로', stock: 110 },
  { product: '청풍', stock: 130 },
  { product: '빨뚜', stock: 100 },
  { product: '진로', stock: 90 },
  { product: '새로', stock: 110 },
  { product: '청풍', stock: 130 },
  { product: '빨뚜', stock: 100 },
  { product: '진로', stock: 90 },
  { product: '새로', stock: 110 },
  { product: '청풍', stock: 130 },
  { product: '빨뚜', stock: 100 },
  { product: '진로', stock: 90 },
  { product: '새로', stock: 110 },
  { product: '청풍', stock: 130 },
  { product: '빨뚜', stock: 100 },
];

const chartConfig =
  /** @type {import('@/components/ui/chart.js').ChartConfig} */ ({
    stock: {
      label: '입고',
      color: 'var(--chart-3)',
    },
  });

export const ProductCountChart = () => {
  const isMobile = useIsMobile();

  const BAR_WIDTH = 32;
  const GAP = isMobile ? 16 : 32;
  const chartWidth = data.length * (BAR_WIDTH + GAP);

  return (
    <ChartContainer
      config={chartConfig}
      className='h-54'
      style={{ minWidth: chartWidth }}
    >
      <BarChart
        data={data}
        barSize={isMobile ? 12 : 24}
        barCategoryGap={16}
      >
        <XAxis
          dataKey='product'
          tickLine={false}
          axisLine={false}
        />

        {!isMobile && (
          <YAxis
            tickLine={false}
            axisLine={false}
          />
        )}

        <Tooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey='stock'
          overlineThickness={0}
          fill='var(--chart-3)'
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};
