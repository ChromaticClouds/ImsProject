import { GraphContainer } from '../statistics/components/graph-container.jsx';
import { ProductCountChart } from './product-count-chart.jsx';

export const ProductCount = () => {
  return (
    <GraphContainer
      title='품목 수량 현황'
      description='각 품목 당 현 재고 수량을 확인'
      width='wide'
      height='md' 
    >
      <ProductCountChart />
    </GraphContainer>
  );
};
