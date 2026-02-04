// @ts-check

// LeadTimeChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { leadTimeMock } from '../constants/index.js';

// lead-time.config.js
export const leadTimeConfig = {
  leadTime: {
    label: '평균 리드타임 (일)',
  },
};

/**
 * @param {{ range: string }} props
 */
export const LeadTimeChart = ({ range }) => {
  return (
    <ChartContainer config={leadTimeConfig} className="h-90 w-full">
      <BarChart data={leadTimeMock}>
        <CartesianGrid strokeDasharray="3 3" />

        {/* 거래처 */}
        <XAxis dataKey="supplier" />

        {/* 평균 리드타임 */}
        <YAxis />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey="leadTime"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};
