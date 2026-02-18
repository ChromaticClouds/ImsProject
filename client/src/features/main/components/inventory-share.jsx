import { GraphContainer } from '../../statistics/components/graph-container.jsx';
import { InventoryShareRadialChart } from './inventory-share-radial-chart.jsx';

export const InventoryShare = () => {
  return (
    <GraphContainer
      title='재고 점유율'
      description='창고 대비 적재된 재고 비율'
      width='third'
      height='lg'
    >
      <InventoryShareRadialChart />
    </GraphContainer>
  );
};
