// @ts-check
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatisticsDateRangePicker } from './statistics-date-range-picker.jsx';

import { GraphContainer } from './graph-container.jsx';
import { InOutboundChart } from './in-out-bound-chart.jsx';

import {
  fetchStatisticsBrands,
  fetchStatisticsInOutByProduct,
  fetchStatisticsTypes,
} from '../api/index.js';

function pad2(n) {
  return String(n).padStart(2, '0');
}
function toYmd(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
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

function toKoreanTypeLabel(v) {
  const map = {
    WHISKEY: '위스키',
    SOJU: '소주',
    TRADITIONAL: '전통주',
    LIQUOR: '양주',
    KAOLIANG_LIQUOR: '고량주',
  };
  return map[String(v)] ?? String(v ?? '');
}

export const InOutBound = () => {
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

  const typesQ = useQuery({
    queryKey: ['stats-types'],
    queryFn: fetchStatisticsTypes,
    staleTime: 60_000,
  });

  const brandsQ = useQuery({
    queryKey: ['stats-brands', type],
    queryFn: () => fetchStatisticsBrands({ type }),
    enabled: Boolean(type),
    staleTime: 60_000,
  });

  useEffect(() => {
    setBrand('');
  }, [type]);

  const statsQ = useQuery({
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
    const rows = Array.isArray(statsQ.data) ? statsQ.data : [];
    return rows.map((r) => ({
      item: r.productName ?? '-',
      inbound: Number(r.inboundQty ?? 0),
      outbound: Number(r.outboundQty ?? 0),
      total: Number(r.totalQty ?? 0),
    }));
  }, [statsQ.data]);

  return (
    <GraphContainer
      title="입출고 수량 합계 통계"
      description="기간/품목/주종/브랜드 기준 품목별 입출고 수량 합계"
      width="wide"
      height="lg"
    >
      {/* 필터 */}
      <div className='flex flex-wrap items-end gap-3 mb-3'>
        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>기간</label>
          <StatisticsDateRangePicker
            value={{ from, to }}
            onChange={({ from, to }) => {
              setFrom(from);
              setTo(to);
            }}
            disabled={false}
            minDateYMD={undefined}
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>품목 검색</label>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='품목명/코드'
            className='h-9 w-40 rounded-md border px-2'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>주종</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className='h-9 w-20 rounded-md border px-2'
          >
            <option value=''>전체</option>
            {(typesQ.data ?? []).map((t) => (
              <option
                key={t}
                value={t}
              >
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>브랜드</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            disabled={!type}
            className='h-9 w-40 rounded-md border px-2 disabled:opacity-60'
          >
            <option value=''>{type ? '전체' : '주종 선택 필수'}</option>
            {(brandsQ.data ?? []).map((b) => (
              <option
                key={b}
                value={b}
              >
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {dateError ? (
        <div className='mb-2 text-sm font-semibold text-red-600'>
          {dateError}
        </div>
      ) : null}

      {statsQ.isFetching ? (
        <div className='text-sm text-muted-foreground'>
          데이터 불러오는 중...
        </div>
      ) : statsQ.isError ? (
        <div className='text-sm text-red-600'>통계 조회 실패</div>
      ) : (
        <InOutboundChart data={chartData} />
      )}
    </GraphContainer>
  );
};
