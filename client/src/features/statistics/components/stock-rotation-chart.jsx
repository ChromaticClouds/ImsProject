// @ts-check

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';

import { useIsMobile } from '@/hooks/use-mobile.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from '@/components/ui/popover.js';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

import {
  fetchStatisticsSearchProducts,
  fetchStatisticsStockRotationTrend,
} from '@/features/statistics/api/index.js';

const turnoverTrendConfig =
  /** @type {import('@/components/ui/chart').ChartConfig} */ ({
    turnover: { label: '재고 회전율' },
  });

function getYearOptions() {
  const y = new Date().getFullYear();
  return [y, y - 1];
}
function getMaxMonthForYear(year) {
  const now = new Date();
  return year === now.getFullYear() ? now.getMonth() + 1 : 12;
}

/** @param {{ active?: boolean, payload?: any[] }} props */
function TurnoverTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div className="rounded-md border bg-background px-3 py-2 text-sm shadow-md">
      <div className="font-semibold">{d.period}</div>
      <div className="mt-1 flex flex-col gap-1">
        <div>
          회전율: <b>{Number(d.turnover ?? 0).toFixed(2)}</b>
        </div>
        {d.outboundQty != null ? (
          <div>
            총 출고: <b>{Number(d.outboundQty).toLocaleString()}</b>
          </div>
        ) : null}
        {d.avgStock != null ? (
          <div>
            평균재고: <b>{Number(d.avgStock).toLocaleString()}</b>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * ✅ 라벨이 0.0으로만 보이는 문제를 확실히 끊는 방법:
 * LabelList formatter 대신 content로 "payload.turnover"를 직접 읽어서 그린다.
 *
 * @param {any} props
 */
function TurnoverLabel(props) {
  const { x, y, payload } = props;
  const t = Number(payload?.turnover ?? 0);

  // 평균재고 0이면 회전율 의미 없으니 라벨 숨김(원하면 제거해도 됨)
  if (!Number.isFinite(t) || t === 0) return null;

  // 라벨 위치 (점 위)
  const dx = Number(x ?? 0);
  const dy = Number(y ?? 0);

  return (
    <text
      x={dx}
      y={dy - 10}
      textAnchor="middle"
      fontSize={12}
      fill="currentColor"
      opacity={0.9}
    >
      {t.toFixed(2)}
    </text>
  );
}

function useDebounced(value, delayMs) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return v;
}

export const StockRotationChart = () => {
  const isMobile = useIsMobile();

  // ✅ Year/Month
  const yearOptions = useMemo(() => getYearOptions(), []);
  const [year, setYear] = useState(yearOptions[0]);
  const [month, setMonth] = useState(/** @type {number|null} */ (null));

  const [yearOpen, setYearOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);

  useEffect(() => {
    setMonth(null);
  }, [year]);

  const maxMonth = useMemo(() => getMaxMonthForYear(year), [year]);
  const monthOptions = useMemo(
    () => Array.from({ length: maxMonth }, (_, i) => i + 1),
    [maxMonth]
  );

  // ✅ 제품 검색/선택
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounced(keyword.trim(), 200);

  const [selectedProduct, setSelectedProduct] = useState(
    /** @type {{ productId: number, productName: string, productCode?: string } | null} */ (null)
  );

  const searchBoxRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const anchorRef = useRef(null);

  const productsQ = useQuery({
    queryKey: ['stats-products-search', debouncedKeyword],
    enabled: debouncedKeyword.length >= 1,
    queryFn: () =>
      fetchStatisticsSearchProducts({
        keyword: debouncedKeyword,
        limit: 20,
      }),
    staleTime: 10_000,
  });

  const productOptions = useMemo(() => {
    const rows = Array.isArray(productsQ.data) ? productsQ.data : [];
    return rows;
  }, [productsQ.data]);

  // ✅ 회전율 trend
  const trendQ = useQuery({
    queryKey: [
      'stats-stock-rotation-trend',
      { year, month, productId: selectedProduct?.productId },
    ],
    enabled: Boolean(selectedProduct?.productId),
    queryFn: () =>
      fetchStatisticsStockRotationTrend({
        year,
        month: month ?? undefined,
        productId: /** @type {number} */ (selectedProduct?.productId),
      }),
  });

  const chartData = useMemo(() => {
    const rows = Array.isArray(trendQ.data) ? trendQ.data : [];

    // ✅ 여기서 값이 진짜로 뭐가 들어오는지 한번만 확인해도 됨
    // console.log('trend rows:', rows);

    return rows.map((r) => ({
      period: String(r.period ?? ''),
      turnover: Number(r.turnover ?? 0),
      outboundQty: r.outboundQty == null ? undefined : Number(r.outboundQty),
      beginStock: r.beginStock == null ? undefined : Number(r.beginStock),
      endStock: r.endStock == null ? undefined : Number(r.endStock),
      avgStock: r.avgStock == null ? undefined : Number(r.avgStock),
    }));
  }, [trendQ.data]);

  return (
    <div className="flex flex-col gap-3">
      {/* ✅ 필터 바 */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Year */}
        <Popover open={yearOpen} onOpenChange={setYearOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9">
              {year}년
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-36 p-2" align="start">
            <div className="flex flex-col gap-1">
              {yearOptions.map((y) => (
                <Button
                  key={y}
                  variant={y === year ? 'default' : 'ghost'}
                  className="h-9 justify-start"
                  onClick={() => {
                    setYear(y);
                    setYearOpen(false);
                  }}
                >
                  {y}년
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Month */}
        <Popover open={monthOpen} onOpenChange={setMonthOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9" disabled={!year}>
              {month ? `${month}월` : '월 선택'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2" align="start">
            <div className="grid grid-cols-3 gap-1">
              {monthOptions.map((m) => (
                <Button
                  key={m}
                  variant={m === month ? 'default' : 'ghost'}
                  className="h-9"
                  onClick={() => {
                    setMonth(m);
                    setMonthOpen(false);
                  }}
                >
                  {m}월
                </Button>
              ))}
              <Button
                variant={month == null ? 'default' : 'ghost'}
                className="h-9 col-span-3"
                onClick={() => {
                  setMonth(null);
                  setMonthOpen(false);
                }}
              >
                월 전체(년도 기준)
              </Button>
            </div>
            {year === new Date().getFullYear() ? (
              <div className="mt-2 text-xs text-muted-foreground">
                올해는 {maxMonth}월까지만 선택 가능합니다.
              </div>
            ) : null}
          </PopoverContent>
        </Popover>

        {/* 제품 검색 */}
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <div className="flex items-center gap-2">
            <div className="min-w-[320px] relative">
              <Input
                ref={searchBoxRef}
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  if (!searchOpen) setSearchOpen(true);
                }}
                placeholder="조회할 품목을 검색해주세요"
                className="h-9"
                onFocus={() => setSearchOpen(true)}
              />
              <PopoverAnchor asChild>
                <div
                  ref={anchorRef}
                  className="absolute left-0 top-full w-0 h-0 pointer-events-none"
                  aria-hidden="true"
                />
              </PopoverAnchor>
            </div>

            {selectedProduct ? (
              <Button
                type="button"
                variant="ghost"
                className="h-9"
                onClick={() => {
                  setSelectedProduct(null);
                  setKeyword('');
                  setSearchOpen(false);
                  searchBoxRef.current?.focus();
                }}
              >
                선택 해제
              </Button>
            ) : null}
          </div>

          <PopoverContent
            className="w-[420px] p-2"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            {debouncedKeyword.length < 1 ? (
              <div className="px-2 py-2 text-sm text-muted-foreground">
                검색어를 입력하세요.
              </div>
            ) : productsQ.isFetching ? (
              <div className="px-2 py-2 text-sm text-muted-foreground">
                검색 중...
              </div>
            ) : productOptions.length === 0 ? (
              <div className="px-2 py-2 text-sm text-muted-foreground">
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className="max-h-64 overflow-auto">
                {productOptions.map((p) => (
                  <button
                    key={p.productId}
                    type="button"
                    className="w-full rounded-md px-2 py-2 text-left hover:bg-muted"
                    onClick={() => {
                      setSelectedProduct({
                        productId: Number(p.productId),
                        productName: p.productName ?? '-',
                        productCode: p.productCode ?? '',
                      });
                      setKeyword(
                        `${p.productName ?? ''}${
                          p.productCode ? ` (${p.productCode})` : ''
                        }`
                      );
                      setSearchOpen(false);
                      
                      searchBoxRef.current?.focus();
                    }}
                  >
                    <div className="text-sm font-medium">{p.productName ?? '-'}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.brand ? `${p.brand}` : ''}
                      {p.type ? ` · ${p.type}` : ''}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>

        {trendQ.isFetching ? (
          <span className="text-sm text-muted-foreground">불러오는 중...</span>
        ) : null}
      </div>

      {/* 그래프 미표시 */}
      {!selectedProduct ? (
        <div className="text-sm text-muted-foreground">조회할 제품을 검색해주세요.</div>
      ) : trendQ.isError ? (
        <div className="text-sm text-red-600">재고 회전율 조회 실패</div>
      ) : chartData.length === 0 ? (
        <div className="text-sm text-muted-foreground">표시할 데이터가 없습니다.</div>
      ) : (
        <ChartContainer config={turnoverTrendConfig} className="h-70 w-full">
          <LineChart data={chartData} margin={{ top: 18, right: 12, left: 4, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              interval={0}
              height={isMobile ? 40 : 32}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={isMobile ? 34 : 44}
              tickFormatter={(v) => Number(v).toFixed(isMobile ? 0 : 1)}
            />

            <ChartTooltip content={<TurnoverTooltip />} />

            <Line
              type="monotone"
              dataKey="turnover"
              strokeWidth={2}
              stroke="var(--chart-4)"
              fill="var(--chart-4)"
              dot
              isAnimationActive={false}
            >
              
              <LabelList content={<TurnoverLabel />} />
            </Line>
          </LineChart>
        </ChartContainer>
      )}
    </div>
  );
};
