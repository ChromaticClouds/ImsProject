// @ts-check
import { GraphContainer } from './graph-container.jsx';
import { ClientRankChart } from './client-rank-chart.jsx';
import { ClientRankFilter } from '@/features/statistics/components/client-rank-filter.jsx';

export const ClientRank = () => {
  return (
    <GraphContainer
      title="거래처 순위 통계"
      description="TOP 5 거래처 입출고 순위"
      width="third"
      height="lg"
      headerAction={<ClientRankFilter />}
    >
      <ClientRankChart />
    </GraphContainer>
  );
};

