// @ts-check
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile.js';

/**
 * @param {{ data: {partner:string, qty:number}[], mode:'inbound'|'outbound' }} props
 */
export const ClientRankChart = ({ data = [], mode }) => {
  const isMobile = useIsMobile();

  

  const chartConfig = {
    qty: {
      label: mode === 'inbound' ? '입고' : '출고',
      color: mode === 'inbound' ? 'var(--chart-1)' : 'var(--chart-2)',
    },
  };

  

  return (
    <ChartContainer className="h-50 w-full" config={chartConfig}>
      <BarChart
        data={data}
        layout="vertical"
        barSize={isMobile ? 18 : 24}
        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
      >
        <CartesianGrid horizontal={false} />
        <XAxis type="number" />
        <YAxis
          dataKey="partner"
          type="category"
          width={90}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="qty"
          fill={mode === 'inbound' ? 'var(--chart-1)' : 'var(--chart-2)'}
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};
