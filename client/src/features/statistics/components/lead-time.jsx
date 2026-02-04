import { GraphContainer } from "./graph-container.jsx";
import { LeadTimeChart } from "./lead-time-chart.jsx";

export const LeadTime = () => {
  return (
    <GraphContainer
      title='리드타임'
      description='품목 및 거래처별 리드타임'
      width='full'
    >
      <LeadTimeChart />
    </GraphContainer>
  );
};
