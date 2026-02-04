// @ts-check

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { partnerRankMock } from '../constants/index.js';

export const partnerRankConfig = {
  outbound: {
    label: '출고 수량',
  },
};

export const ClientRankChart = () => {
  return (
    <ChartContainer
      config={partnerRankConfig}
      className='h-80 w-full'
    >
      <BarChart
        data={partnerRankMock}
        layout='vertical'
        margin={{ left: 20 }}
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
          radius={6}
        />
      </BarChart>
    </ChartContainer>
  );
};
