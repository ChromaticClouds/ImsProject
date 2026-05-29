// @ts-check

/**
 * Components
 */
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
import { ChartEmpty } from './chart-empty.jsx';
import { ChartLoading } from './chart-loading.jsx';

/**
 * Hooks
 */
import { useIsMobile } from '@/hooks/use-mobile.js';
import { useClientRankQuery } from '@/features/statistics/hooks/use-client-rank-query.js';
import { useDebounceFetch } from '@/features/statistics/hooks/use-debounce-fetch.js';

export const ClientRankChart = () => {
  const {
    mode,
    chartData: data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useClientRankQuery();
  const { refreshPending, handleRefresh } = useDebounceFetch(refetch);

  const isMobile = useIsMobile();

  const chartConfig = {
    qty: {
      label: mode === 'inbound' ? '입고' : '출고',
      color: mode === 'inbound' ? 'var(--chart-1)' : 'var(--chart-2)',
    },
  };

  if (isLoading) return <ChartLoading />;

  if (isError || data.length === 0) {
    return (
      <ChartEmpty
        title={
          isError
            ? '거래처 순위를 불러오지 못했습니다.'
            : '거래처 순위 데이터가 없습니다.'
        }
        description={
          isError
            ? '잠시 후 다시 조회해 주세요.'
            : '선택한 기간에 표시할 거래처 순위 통계가 없습니다.'
        }
        isRefreshing={refreshPending || isFetching}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <ChartContainer
      className='h-80 w-full'
      config={chartConfig}
    >
      <BarChart
        data={data}
        layout='vertical'
        barSize={isMobile ? 18 : 24}
        margin={{ top: 10, right: 40, left: 10, bottom: 10 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis type='number' />
        <YAxis
          dataKey='partner'
          type='category'
          width={90}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey='qty'
          fill={mode === 'inbound' ? 'var(--chart-1)' : 'var(--chart-2)'}
          radius={[0, 8, 8, 0]}
        >
          {/* 데이터 레이블 */}
          <LabelList
            dataKey='qty'
            position='right'
            style={{ fontSize: 12, fill: 'var(--foreground)' }}
            formatter={(/** @type {string} */ v) => Number(v).toLocaleString()}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};
