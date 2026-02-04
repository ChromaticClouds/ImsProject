import { GraphContainer } from './graph-container.jsx';
import { InOutboundChart } from './in-out-bound-chart.jsx';

export const InOutBound = () => {
  return (
    <GraphContainer
      title='입출고 수량 합계 통계'
      description='각 품목 당 입출고 수량 합계'
      width='wide'
    >
      <InOutboundChart />
    </GraphContainer>
  );
};
