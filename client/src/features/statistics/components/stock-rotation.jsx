import { GraphContainer } from './graph-container.jsx';
import { StockRotationChart } from './stock-rotation-chart.jsx';

export const StockRotation = () => {
  return (
    <GraphContainer
      title='재고 회전율'
      description='기간 내 각 품목 당 재고 회전율'
      width='wide'
    >
      <StockRotationChart />
    </GraphContainer>
  );
};
