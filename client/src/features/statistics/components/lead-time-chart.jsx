// @ts-check

// LeadTimeChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { useIsMobile } from '@/hooks/use-mobile.js';
import { useLeadTimeQuery } from '../hooks/use-lead-time-query.js';
import { ChartLoading } from './chart-loading.jsx';

export const leadTimeConfig = {
  name: {
    label: '대상',
  },
  leadTime: {
    label: '평균 리드타임 (일)',
  },
};

/**
 * 평균 리드타임 차트
 */
export const LeadTimeChart = () => {
  const { data: chartData } = useLeadTimeQuery();
  const isMobile = useIsMobile();

  if (!chartData || chartData.length === 0) return <ChartLoading />;

  const BAR_WIDTH = 32;
  const GAP = isMobile ? 16 : 32;
  const chartWidth = chartData.length * (BAR_WIDTH + GAP);

  return (
    <div className='w-full overflow-x-auto'>
      <ChartContainer
        config={leadTimeConfig}
        className='h-80 w-full'
        style={{ minWidth: chartWidth }}
      >
        <BarChart
          width={Math.max(chartWidth, 600)}
          data={chartData}
          barSize={isMobile ? 12 : 24}
          barCategoryGap={GAP}
        >
          <CartesianGrid strokeDasharray='3 3' />

          {/* 거래처 및 품목 */}
          <XAxis
            dataKey='name'
            height={50}
            angle={-15}
            textAnchor='end'
            hide={isMobile}
            tickFormatter={(value) =>
              value.length > 8 ? value.slice(0, 12) + '…' : value
            }
          />

          {/* 평균 리드타임 */}
          <YAxis />

          <ChartTooltip content={<ChartTooltipContent />} />

          <Bar
            dataKey='leadTime'
            fill='var(--chart-4)'
            radius={[6, 6, 0, 0]}
          >
            <LabelList
              dataKey='leadTime'
              position='top'
              content={
                /** @param {{ x: number, y: number, value: string }} props */
                ({ x, y, value }) => (
                  <text
                    x={isMobile ? x + 6 : x + 12}
                    y={y - 10}
                    fill='var(--foreground)'
                    fontSize={12}
                    textAnchor='middle'
                  >
                    {value}일
                  </text>
                )
              }
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
