import { StockShareRadialChart } from "@/features/main/components/stock-share-radial-chart.jsx"
import { GraphContainer } from "@/features/statistics/components/graph-container.jsx"

export const StockShareRate = () => {
  return (
    <GraphContainer
      title="창고 내 총 재고 점유율"
      description="현 재고가 창고 내에서 차지하는 비율을 표기"
      width="third"
      staticHeight="md"
    >
      <StockShareRadialChart />
    </GraphContainer>
  )
}