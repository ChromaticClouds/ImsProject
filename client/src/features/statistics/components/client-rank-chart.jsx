// @ts-check

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { partnerRankMock } from '../constants/index.js';
import { useIsMobile } from '@/hooks/use-mobile.js';

export const partnerRankConfig = {
  outbound: {
    label: '출고 수량',
  },
};

export const ClientRankChart = () => {
  const isMobile = useIsMobile();

  return (
    <ChartContainer
      config={partnerRankConfig}
      className='h-80 w-full'
    >
      <BarChart
        data={partnerRankMock}
        barSize={isMobile ? 20 : 24}
        layout='vertical'
      >
        <CartesianGrid horizontal={false} />

        <XAxis type='number' />
        <YAxis
          dataKey='partner'
          type='category'
          width={80}
        />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey='outbound'
          fill='var(--chart-2)'
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};
