import { ClientRankChart } from './client-rank-chart.jsx';
import { GraphContainer } from './graph-container.jsx';

export const ClientRank = () => {
  return (
    <GraphContainer
      title='거래처 순위 통계'
      description='TOP 5로 가장 입출고 내역이 잦은 거래처'
      width='third'
    >
      <ClientRankChart />
    </GraphContainer>
  );
};
