import { GraphContainer } from './graph-container.jsx';
import { StockShareChart } from './stock-share-chart.jsx';

export const StockShare = () => {
  return (
    <GraphContainer
      title='재고 점유율'
      description='창고 및 각 재고 점유율'
      width='third'
    >
      <StockShareChart />
    </GraphContainer>
  );
};
