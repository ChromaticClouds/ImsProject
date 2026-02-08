import { GraphContainer } from '@/features/statistics/components/graph-container.jsx';
import { ProductCountChart } from '@/features/main/components/product-count-chart.jsx';

export const ProductCount = () => {
  return (
    <GraphContainer
      title='품목 별 수량'
      description='현재 보유 중인 재고 수량을 표기'
      width='wide'
      staticHeight='md'
    >
      <ProductCountChart />
    </GraphContainer>
  );
};
