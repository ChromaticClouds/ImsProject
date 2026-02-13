// @ts-check

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.js';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

const chartConfig = {
  monitored: {
    label: 'Total monitored',
    color: 'var(--chart-3)',
  },
  limit: {
    label: 'Available limit',
    color: 'var(--color-secondary)',
  },
};

export const STOCK_MONITORED = [{ monitored: 240, limit: 60 }];

export const StockShareRadialChart = () => {
  const totalLimits = STOCK_MONITORED[0].monitored + STOCK_MONITORED[0].limit;

  return (
    <ChartContainer
      config={chartConfig}
      className='w-78'
    >
      <RadialBarChart
        data={STOCK_MONITORED}
        innerRadius={120}
        outerRadius={180}
        cy={180}
        startAngle={0}
        endAngle={180}
      >
        <RadialBar
          dataKey='limit'
          stackId='a'
          fill='var(--color-limit)'
          cornerRadius={20}
          className='stroke-transparent stroke-2'
        />

        <RadialBar
          dataKey='monitored'
          stackId='a'
          fill='var(--chart-3)'
          cornerRadius={20}
          className='stroke-transparent stroke-2'
        />

        <PolarRadiusAxis
          tick={false}
          tickLine={false}
          axisLine={false}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor='middle'
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className='fill-foreground text-2xl font-bold'
                    >
                      {totalLimits.toLocaleString()}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
      </RadialBarChart>
    </ChartContainer>
  );
};
