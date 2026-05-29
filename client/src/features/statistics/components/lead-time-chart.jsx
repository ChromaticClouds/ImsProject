// @ts-check

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { useIsMobile } from '@/hooks/use-mobile.js';
import { useLeadTimeQuery } from '../hooks/use-lead-time-query.js';
import { ChartEmpty } from './chart-empty.jsx';
import { ChartLoading } from './chart-loading.jsx';
import { useDebounceFetch } from '@/features/statistics/hooks/use-debounce-fetch.js';

export const leadTimeConfig = {
  name: {
    label: '대상',
  },
  leadTime: {
    label: '평균 리드타임 (일)',
  },
};

export const LeadTimeChart = () => {
  const {
    data: chartData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useLeadTimeQuery();
  const isMobile = useIsMobile();

  const { refreshPending, handleRefresh } = useDebounceFetch(refetch);

  if (isLoading || (isFetching && !chartData)) return <ChartLoading />;

  if (isError || !chartData || chartData.length === 0) {
    return (
      <ChartEmpty
        title={
          isError
            ? '리드타임 데이터를 불러오지 못했습니다.'
            : '리드타임 데이터가 없습니다.'
        }
        description={
          isError
            ? '잠시 후 다시 조회하거나 조건을 변경해 주세요.'
            : '선택한 기간과 기준에 해당하는 리드타임 통계가 없습니다.'
        }
        isRefreshing={refreshPending || isFetching}
        onRefresh={handleRefresh}
      />
    );
  }

  const BAR_WIDTH = 32;
  const GAP = isMobile ? 16 : 32;
  const chartWidth = chartData.length * (BAR_WIDTH + GAP * 3);

  return (
    <div className='w-full overflow-x-auto'>
      <ChartContainer
        config={leadTimeConfig}
        className='h-78 w-full'
        style={{ minWidth: chartWidth }}
      >
        <BarChart
          width={Math.max(chartWidth, 600)}
          data={chartData}
          barSize={isMobile ? 12 : 24}
          barCategoryGap={GAP}
          margin={{ top: 30 }}
        >
          <CartesianGrid strokeDasharray='3 3' />

          <XAxis
            dataKey='name'
            height={40}
            angle={0}
            textAnchor='middle'
            hide={isMobile}
            tickFormatter={(value) =>
              value.length > 8 ? `${value.slice(0, 12)}...` : value
            }
          />

          {!isMobile && <YAxis width={30} />}

          <ChartTooltip content={<ChartTooltipContent />} />

          <Bar
            dataKey='leadTime'
            fill='var(--chart-4)'
            radius={[6, 6, 0, 0]}
          >
            <LabelList
              dataKey='leadTime'
              position='top'
              content={(props) => {
                const { x, y, value } = props || {};
                const nx =
                  typeof x === 'number' ? (isMobile ? x + 6 : x + 12) : 0;
                const ny = typeof y === 'number' ? y - 10 : 0;

                return (
                  <text
                    x={nx}
                    y={ny}
                    fill='var(--foreground)'
                    fontSize={12}
                    textAnchor='middle'
                  >
                    {String(value ?? '')}일
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
