import { GraphContainer } from './graph-container.jsx';
import { useInOutBoundStatistics } from '@/features/statistics/hooks/use-in-out-bound-statistics.js';

import { InOutBoundContent } from './in-out-bound-content.jsx';
import { InOutBoundFilter } from './in-out-bound-filter.jsx';

export const InOutBound = () => {
  const { filters, actions, dateError, query, chartData } =
    useInOutBoundStatistics();

  return (
    <GraphContainer
      title='입출고 수량 합계 통계'
      description='기간/품목/주종/브랜드 기준 품목별 입출고 수량 합계'
      width='wide'
      height='lg'
    >
      <InOutBoundFilter
        filters={filters}
        actions={actions}
      />

      {dateError ? (
        <div className='mb-2 text-sm font-semibold text-red-600'>
          {dateError}
        </div>
      ) : null}

      <InOutBoundContent
        chartData={chartData}
        isFetching={query.isFetching}
        isError={query.isError}
        onRefresh={query.refetch}
      />
    </GraphContainer>
  );
};
