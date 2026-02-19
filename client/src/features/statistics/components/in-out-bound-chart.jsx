
// @ts-check
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, LabelList } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

import { useIsMobile } from '@/hooks/use-mobile.js';

export const inboundOutboundConfig = {
  inbound: { label: '입고', color: 'hsl(var(--chart-1))' },
  outbound: { label: '출고', color: 'hsl(var(--chart-2))' },
};

/**
 * 라벨 렌더 함수 (Bar 위에 숫자 표시)
 * - 0은 숨김
 * - 모바일에서는 글자 크기 줄임
 *
 * @param {boolean} isMobile
 */
function makeValueLabel(isMobile) {
  /**
   * @param {any} props
   */
  return function ValueLabel(props) {
    const { x, y, width, value } = props;
    const n = Number(value ?? 0);
    if (!Number.isFinite(n) || n === 0) return null;

    const cx = Number(x ?? 0) + Number(width ?? 0) / 2;
    const cy = Number(y ?? 0) - (isMobile ? 6 : 8);

    return (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        fontSize={isMobile ? 10 : 12}
        fill="hsl(var(--foreground))"
        opacity={0.9}
      >
        {n.toLocaleString()}
      </text>
    );
  };
}

/**
 * @param {{ data: Array<{ item: string, inbound: number, outbound: number, total: number }> }} props
 */
export const InOutboundChart = ({ data }) => {
  const isMobile = useIsMobile();

  const BAR_WIDTH = 32;
  const GAP = isMobile ? 16 : 32;
  const chartWidth = Math.max(1, data.length) * (BAR_WIDTH + GAP);

  // ✅ 라벨이 너무 빽빽하면 여기 기준값을 올려서 표시 개수 줄이기
  const MIN_LABEL_VALUE = isMobile ? 5 : 1;

  const ValueLabel = useMemo(() => makeValueLabel(isMobile), [isMobile]);

  // LabelList formatter로 작은 값 숨기기
  const labelFormatter = (v) => {
    const n = Number(v ?? 0);
    if (!Number.isFinite(n) || n < MIN_LABEL_VALUE) return '';
    return n; // 실제 텍스트는 ValueLabel에서 toLocaleString 처리
  };


  
  return (
    <div className="h-full w-full overflow-x-auto flex items-star">
      <ChartContainer
        config={inboundOutboundConfig}
        className="h-70 w-full"
        style={{ minWidth: chartWidth }}
      >
        <BarChart
          data={data}
          barSize={isMobile ? 12 : 24}
          barCategoryGap={16}
          margin={{ top: 18, right: 20, left: 0, bottom: 30 }} // top을 조금 늘려 라벨 공간 확보
        >


          <CartesianGrid vertical={false} />
          <XAxis dataKey="item" tickLine={false} axisLine={false} angle={-25} textAnchor='end' height={60} />

          <ChartTooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const p = payload?.[0]?.payload;
              return (
                <div className="rounded-md border bg-background p-2 text-sm shadow">
                  <div className="font-semibold mb-1">{label}</div>
                  <div className="flex flex-col gap-0.5">
                    <div>입고: {Number(p?.inbound ?? 0).toLocaleString()}</div>
                    <div>출고: {Number(p?.outbound ?? 0).toLocaleString()}</div>
                    <div className="font-semibold">
                      합계: {Number(p?.total ?? 0).toLocaleString()}
                    </div>
                  </div>
                </div>
                
              );
            }}
          />

          <ChartLegend content={<ChartLegendContent />} />

          <Bar dataKey="inbound" fill="var(--chart-1)" radius={[6, 6, 0, 0]}>
            {/* ✅ 막대 위 데이터 라벨 */}
            <LabelList
              dataKey="inbound"
              position="top"
              formatter={labelFormatter}
              content={<ValueLabel />}
            />
          </Bar>

          <Bar dataKey="outbound" fill="var(--chart-2)" radius={[6, 6, 0, 0]}>
            {/* ✅ 막대 위 데이터 라벨 */}
            <LabelList
              dataKey="outbound"
              position="top"
              formatter={labelFormatter}
              content={<ValueLabel />}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
