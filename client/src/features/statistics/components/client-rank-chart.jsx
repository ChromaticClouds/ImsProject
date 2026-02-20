// // @ts-check

// /**
//  * Components
//  */
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@/components/ui/chart';

// /**
//  * Hooks
//  */
// import { useIsMobile } from '@/hooks/use-mobile.js';
// import { useClientRankQuery } from '@/features/statistics/hooks/use-client-rank-query.js';

// export const ClientRankChart = () => {
//   const { mode, chartData: data } = useClientRankQuery();

//   const isMobile = useIsMobile();

//   const chartConfig = {
//     qty: {
//       label: mode === 'inbound' ? '입고' : '출고',
//       color: mode === 'inbound' ? 'var(--chart-1)' : 'var(--chart-2)',
//     },
//   };

//   return (
//     <ChartContainer
//       className='h-80 w-full'
//       config={chartConfig}
//     >
//       <BarChart
//         data={data}
//         layout='vertical'
//         barSize={isMobile ? 18 : 24}
//         margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
//       >
//         <CartesianGrid horizontal={false} />
//         <XAxis type='number' />
//         <YAxis
//           dataKey='partner'
//           type='category'
//           width={90}
//           tick={{ fontSize: 12 }}
//         />
//         <ChartTooltip content={<ChartTooltipContent />} />
//         <Bar
//           dataKey='qty'
//           fill={mode === 'inbound' ? 'var(--chart-1)' : 'var(--chart-2)'}
//           radius={[0, 8, 8, 0]}
//         />
//       </BarChart>
//     </ChartContainer>
//   );
// };

// @ts-check

/**
 * Components
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

/**
 * Hooks
 */
import { useIsMobile } from '@/hooks/use-mobile.js';
import { useClientRankQuery } from '@/features/statistics/hooks/use-client-rank-query.js';

export const ClientRankChart = () => {
  const { mode, chartData: data } = useClientRankQuery();
  const isMobile = useIsMobile();

  const chartConfig = {
    qty: {
      label: mode === 'inbound' ? '입고' : '출고',
      color: mode === 'inbound' ? 'var(--chart-1)' : 'var(--chart-2)',
    },
  };

  return (
    <ChartContainer
      className="h-80 w-full"
      config={chartConfig}
    >
      <BarChart
        data={data}
        layout="vertical"
        barSize={isMobile ? 18 : 24}
        margin={{ top: 10, right: 40, left: 10, bottom: 10 }} // ← 오른쪽 여백 살짝 늘려야 레이블 안 잘림
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
        >
          {/* ★ 데이터 레이블 */}
          <LabelList
            dataKey="qty"
            position="right"
            style={{ fontSize: 12, fill: 'var(--foreground)' }}
            formatter={(v) => Number(v).toLocaleString()}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};
