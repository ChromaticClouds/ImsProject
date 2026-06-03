import type { RefetchOptions, QueryObserverResult } from '@tanstack/react-query';

import { ChartEmpty } from './chart-empty.jsx';
import { ChartLoading } from './chart-loading.jsx';
import { InOutboundChart } from './in-out-bound-chart.jsx';

type InOutBoundChartData = {
  item: string;
  inbound: number;
  outbound: number;
  total: number;
};

type InOutBoundContentProps = {
  chartData: InOutBoundChartData[];
  isFetching: boolean;
  isError: boolean;
  onRefresh: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<any, Error>>;
};

export const InOutBoundContent = ({
  chartData,
  isFetching,
  isError,
  onRefresh,
}: InOutBoundContentProps) => {
  if (isFetching) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <ChartLoading />
      </div>
    );
  }

  if (isError) {
    return (
      <ChartEmpty
        title='입출고 합계 통계를 불러오지 못했습니다.'
        description='잠시 후 다시 조회하거나 조건을 변경해 주세요.'
        isRefreshing={isFetching}
        onRefresh={onRefresh}
      />
    );
  }

  if (chartData.length === 0) {
    return (
      <ChartEmpty
        title='입출고 합계 데이터가 없습니다.'
        description='선택한 기간과 조건에 해당하는 입출고 합계 통계가 없습니다.'
        isRefreshing={isFetching}
        onRefresh={onRefresh}
      />
    );
  }

  return <InOutboundChart data={chartData} />;
};
