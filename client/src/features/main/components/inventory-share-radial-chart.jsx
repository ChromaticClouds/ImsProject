import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.js';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { useWarehouseShareQuery } from '../../statistics/hooks/use-warehouse-share-query.js';
import { ChartLoading } from '@/features/statistics/components/chart-loading.jsx';

export const VENDOR_MONITORED = [{ stocked: 240, limit: 60 }];

const chartConfig = {
  used: {
    label: '사용 중',
    color: 'var(--chart-3)',
  },
  available: {
    label: '남은 용량',
    color: 'var(--color-secondary)',
  },
};

export const InventoryShareRadialChart = () => {
  const { data, isFetching } = useWarehouseShareQuery();

  const used = data?.usedVolume;
  const total = data?.totalVolume;
  const available = Math.max(total - used, 0);

  const chartData = [
    {
      used,
      available,
    },
  ];

  const usageRate = total > 0 ? (used / total) * 100 : 0;

  return (
    <ChartContainer
      config={chartConfig}
      className='w-full h-60'
    >
      {!data && isFetching ? (
        <ChartLoading />
      ) : (
        <RadialBarChart
          data={chartData}
          innerRadius={120}
          outerRadius={180}
          cy={180}
          startAngle={0}
          endAngle={180}
        >
          <RadialBar
            dataKey='available'
            stackId='a'
            fill='var(--color-secondary)'
            cornerRadius={20}
            className='stroke-transparent stroke-2'
          />

          <RadialBar
            dataKey='used'
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
                        y={(viewBox.cy || 0) - 24}
                        className='fill-foreground text-xl font-bold'
                      >
                        {usageRate.toFixed(1)}%
                      </tspan>

                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 2}
                        className='fill-muted-foreground text-sm'
                      >
                        {used?.toLocaleString()} / {total?.toLocaleString()}
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
      )}
    </ChartContainer>
  );
};
