// @ts-check
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
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

  const yAxisWidth = useMemo(() => {
    const longest = Math.max(0, ...data.map((d) => String(d.partner ?? '').length));
    const base = isMobile ? 72 : 92;
    const perChar = isMobile ? 6 : 7;
    const w = base + Math.min(longest, isMobile ? 12 : 16) * perChar;
    return Math.max(isMobile ? 80 : 100, Math.min(w, isMobile ? 130 : 170));
  }, [data, isMobile]);

  const xDomain = useMemo(() => {
    const max = Math.max(0, ...data.map((d) => Number(d.qty ?? 0)));
    const pad = Math.ceil(max * 0.12);
    return [0, max + Math.max(pad, 10)];
  }, [data]);

  const maxChars = isMobile ? 6 : 10;

  /** @param {any} props */
  const EllipsisTick = (props) => {
    const x = props?.x ?? 0;
    const y = props?.y ?? 0;
    const full = String(props?.payload?.value ?? '');
    const short = full.length > maxChars ? `${full.slice(0, maxChars)}…` : full;

    return (
      <g transform={`translate(${x},${y})`}>
        <title>{full}</title>
        <text
          x={0}
          y={0}
          dy={4}
          textAnchor="end"
          fontSize={12}
          fill="hsl(var(--muted-foreground))"
        >
          {short}
        </text>
      </g>
    );
  };

  /** @param {any} props */
  const RightValueLabel = (props) => {
    const x = props?.x ?? 0;
    const y = props?.y ?? 0;
    const width = props?.width ?? 0;
    const height = props?.height ?? 0;
    const n = Number(props?.value ?? 0);
    if (!Number.isFinite(n) || n === 0) return null;

    return (
      <text
        x={x + width + 6}
        y={y + height / 2 + 4}
        fontSize={isMobile ? 11 : 12}
        fill="hsl(var(--foreground))"
        textAnchor="start"
        opacity={0.9}
      >
        {n.toLocaleString()}
      </text>
    );
  };

  return (
    <div className="h-full w-full">
      <ChartContainer className="h-full w-full" config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            barSize={isMobile ? 18 : 24}
            barCategoryGap={isMobile ? 10 : 14}
            margin={{ top: 6, right: 60, left: 8, bottom: 6 }}
          >
            <CartesianGrid horizontal={false} />

            <XAxis
              type="number"
              domain={xDomain}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />

            <YAxis
              dataKey="partner"
              type="category"
              width={110}
              tickLine={false}
              axisLine={false}
              tick={<EllipsisTick />}
            />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar
              dataKey="qty"
              fill={mode === 'inbound' ? 'var(--chart-1)' : 'var(--chart-2)'}
              radius={[0, 8, 8, 0]}
            >
              <LabelList dataKey="qty" position="right" content={<RightValueLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
