// @ts-check

// LeadTimeChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { leadTimeMock } from '../constants/index.js';
import { useIsMobile } from '@/hooks/use-mobile.js';
import { useLeadTimeQuery } from '../hooks/use-lead-time-query.js';
import { useEffect } from 'react';

export const leadTimeConfig = {
  leadTime: {
    label: '평균 리드타임 (일)',
  },
};

/**
 * 평균 리드타임 차트
 */
export const LeadTimeChart = () => {
  const { data } = useLeadTimeQuery();
  const isMobile = useIsMobile();

  const chartData = data ?? [];

  const BAR_WIDTH = 32;
  const GAP = isMobile ? 16 : 32;
  const chartWidth = chartData.length * (BAR_WIDTH + GAP);

  return (
    <ChartContainer
      config={leadTimeConfig}
      className='h-80 w-full'
      style={{ minWidth: chartWidth }}
    >
      <BarChart
        data={chartData}
        barSize={isMobile ? 12 : 24}
      >
        <CartesianGrid strokeDasharray='3 3' />

        {/* 거래처 */}
        <XAxis dataKey='name' />

        {/* 평균 리드타임 */}
        <YAxis />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey='leadTime'
          fill='var(--chart-4)'
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};
