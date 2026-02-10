// @ts-check

import { GraphContainer } from './graph-container.jsx';
import { StockShareChangeSlot } from './stock-share-change-slot.jsx';
import { ProductShareChart } from './product-share-chart.jsx';
import { useState } from 'react';
import { WarehouseShareChart } from './warehouse-share-chart.jsx';

/**
 * @typedef {'PRODUCT' | 'WAREHOUSE'} ChartState
 */

const CHART_MAP = /** @type {const} */ {
  WAREHOUSE: <WarehouseShareChart />,
  PRODUCT: <ProductShareChart />,
}

/**
 * 재고 점유율 차트
 */
export const StockShare = () => {
  /** @type {[ChartState, React.Dispatch<React.SetStateAction<ChartState>>]} */
  const [chartState, setChartState] = useState('WAREHOUSE');

  return (
    <GraphContainer
      title='재고 점유율'
      description='창고 및 각 재고 점유율'
      width='third'
      height='lg'
      headerAction={<StockShareChangeSlot onChange={setChartState} />}
    >
      {CHART_MAP[chartState]}
    </GraphContainer>
  );
};
