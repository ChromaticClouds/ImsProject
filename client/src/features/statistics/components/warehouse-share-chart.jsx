// @ts-check

import { ChartContainer } from '@/components/ui/chart.js';
import { PieChart, Pie, Cell } from 'recharts';
import { useWarehouseShareQuery } from '../hooks/use-warehouse-share-query.js';
import { Spinner } from '@/components/ui/spinner.js';
import { ChartLoading } from './chart-loading.jsx';

export const stockShareConfig = {
  value: {
    label: '재고 수량',
  },
};

export const WarehouseShareChart = () => {
  const { data, isLoading, isError } = useWarehouseShareQuery();

  if (isLoading) return <ChartLoading />;
  if (isError || !data) return <div>데이터 없음</div>;

  const usedRate = Math.round((data.usedVolume / data.totalVolume) * 100);

  const chartData = [
    { name: '사용 중', value: usedRate, fill: 'var(--chart-2)' },
    { name: '여유 공간', value: 100 - usedRate, fill: 'var(--muted)' },
  ];

  return (
    <div className='h-full flex flex-col gap-6 relative'>
      <ChartContainer
        config={stockShareConfig}
        className='relative h-72 w-full'
      >
        <PieChart>
          <Pie
            data={chartData}
            nameKey='name'
            dataKey='value'
            cx='50%'
            cy='50%'
            innerRadius='55%'
            outerRadius='75%'
            startAngle={90}
            endAngle={-270}
            cornerRadius={60}
            stroke='none'
          >
            {chartData.map((_, index) => (
              <Cell key={index} />
            ))}
          </Pie>

          {/* Center Label */}
          <text
            x='50%'
            y='48%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='text-2xl font-bold fill-foreground'
          >
            {usedRate}%
          </text>

          {/* Center Label */}
          <text
            x='50%'
            y='58%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='text-sm fill-muted-foreground'
          >
            창고사용률
          </text>
        </PieChart>
      </ChartContainer>
      <div className='flex flex-col gap-1 absolute bottom-0 left-0 text-sm text-muted-foreground'>
        <p>사용한 면적 {data.usedVolume}m³</p>
        <p>창고 적재 가능 면적 {data.totalVolume}m³</p>
      </div>
    </div>
  );
};
