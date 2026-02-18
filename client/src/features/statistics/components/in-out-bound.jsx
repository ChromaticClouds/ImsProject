// @ts-check

/**
 * Components
 */
import { StatisticsDateRangePicker } from './statistics-date-range-picker.jsx';
import { GraphContainer } from './graph-container.jsx';
import { InOutboundChart } from './in-out-bound-chart.jsx';
import {
  fetchStatisticsInOutByProduct,
  fetchStatisticsTypes,
} from '../api/index.js';
import { BrandDropdown } from '@/features/statistics/components/brand-dropdown.jsx';

/**
 * Hooks
 */
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TypeDropdown } from '@/features/statistics/components/type-dropdown.jsx';
import { useIsMobile } from '@/hooks/use-mobile.js';

function pad2(n) {
  return String(n).padStart(2, '0');
}
function toYmd(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function isFutureYmd(ymd) {
  const today = toYmd(new Date());
  return String(ymd) > today;
}
function overOneYear(from, to) {
  const f = new Date(from);
  const t = new Date(to);
  const plus = new Date(f.getFullYear() + 1, f.getMonth(), f.getDate());
  return plus < t;
}

export const InOutBound = () => {
  const isMobile = useIsMobile();

  const today = useMemo(() => new Date(), []);
  const defaultFrom = useMemo(() => toYmd(startOfMonth(today)), [today]);
  const defaultTo = useMemo(() => toYmd(today), [today]);

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);

  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');

  const [dateError, setDateError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword.trim()), 250);
    return () => clearTimeout(t);
  }, [keyword]);

  useEffect(() => {
    if (!from || !to) return;

    if (String(from) > String(to)) {
      setDateError('시작일이 종료일보다 뒤일 수 없습니다.');
      return;
    }
    if (isFutureYmd(from) || isFutureYmd(to)) {
      setDateError('미래 날짜 선택 불가');
      return;
    }
    if (overOneYear(from, to)) {
      setDateError('날짜 설정 범위 한도 초과입니다.');
      return;
    }
    setDateError('');
  }, [from, to]);

  const { data, isFetching } = useQuery({
    queryKey: ['stats-inout', { from, to, debouncedKeyword, type, brand }],
    enabled: Boolean(from && to && !dateError),
    queryFn: () =>
      fetchStatisticsInOutByProduct({
        from,
        to,
        keyword: debouncedKeyword || undefined,
        type: type || undefined,
        brand: brand || undefined,
        limit: 300,
      }),
  });

  const chartData = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    return rows.map((r) => ({
      item: r.productName ?? '-',
      inbound: Number(r.inboundQty ?? 0),
      outbound: Number(r.outboundQty ?? 0),
      total: Number(r.totalQty ?? 0),
    }));
  }, [data]);

  return (
    <GraphContainer
      title='입출고 수량 합계 통계'
      description='기간/품목/주종/브랜드 기준 품목별 입출고 수량 합계'
      width='wide'
      height='lg'
    >
      {/* 필터 */}
      <div className='flex flex-wrap items-end gap-2'>
        <div className='flex flex-col gap-2'>
          <label className='text-xs text-muted-foreground'>기간</label>
          <StatisticsDateRangePicker
            value={{ from, to }}
            onChange={({ from, to }) => {
              setFrom(from);
              setTo(to);
            }}
            disabled={false}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-xs text-muted-foreground'>품목 검색</label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='품목명/코드'
            className={`${isMobile ? 'h-10' : 'h-9'} w-40 rounded-md border px-2`}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-xs text-muted-foreground'>주종</label>
          <TypeDropdown
            type={type}
            setType={setType}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-xs text-muted-foreground'>브랜드</label>
          <BrandDropdown
            type={type}
            brand={brand}
            setBrand={setBrand}
          />
        </div>

        <div className='flex flex-col gap-1 items-center'>
          <div className='flex gap-1 items-center'>
            <div className='rounded w-3 h-3 bg-chart-1' />
            <span className='text-muted-foreground text-xs'>입고</span>
          </div>
          <div className='flex gap-1 items-center'>
            <div className='rounded w-3 h-3 bg-chart-2' />
            <span className='text-muted-foreground text-xs'>출고</span>
          </div>
        </div>
      </div>

      <InOutboundChart
        data={chartData}
        isFetching={isFetching}
      />
    </GraphContainer>
  );
};
