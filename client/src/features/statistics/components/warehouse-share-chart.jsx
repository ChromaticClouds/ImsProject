// @ts-check

import { ChartContainer } from '@/components/ui/chart.js';
import { PieChart, Pie, Cell } from 'recharts';
import { useWarehouseShareQuery } from '../hooks/use-warehouse-share-query.js';
import { ChartEmpty } from './chart-empty.jsx';
import { ChartLoading } from './chart-loading.jsx';

export const stockShareConfig = {
  value: {
    label: '재고 수량',
  },
};

export const WarehouseShareChart = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useWarehouseShareQuery();

  if (isLoading) return <ChartLoading />;

  if (isError || !data || !data.totalVolume) {
    return (
      <ChartEmpty
        title={
          isError
            ? '창고 사용률을 불러오지 못했습니다.'
            : '창고 사용률 데이터가 없습니다.'
        }
        description={
          isError
            ? '잠시 후 다시 조회해 주세요.'
            : '창고 적재 가능 면적 정보가 없어 사용률을 계산할 수 없습니다.'
        }
        isRefreshing={isFetching}
        onRefresh={refetch}
      />
    );
  }

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

          <text
            x='50%'
            y='48%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='text-2xl font-bold fill-foreground'
          >
            {usedRate}%
          </text>

          <text
            x='50%'
            y='58%'
            textAnchor='middle'
            dominantBaseline='middle'
            className='text-sm fill-muted-foreground'
          >
            창고 사용률
          </text>
        </PieChart>
      </ChartContainer>
      <div className='flex flex-col gap-1 absolute bottom-0 left-0 text-sm text-muted-foreground'>
        <p>사용 면적 {data.usedVolume}m²</p>
        <p>창고 적재 가능 면적 {data.totalVolume}m²</p>
      </div>
    </div>
  );
};
