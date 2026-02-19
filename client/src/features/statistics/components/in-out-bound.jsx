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

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChartLoading } from './chart-loading.jsx';

function pad2(n) {
  return String(n).padStart(2, '0');
}
function toYmd(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
// (참고) endOfMonth는 지금 코드에서 사용하지 않아서 유지/삭제는 선택
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

  // ✅ Select는 빈 문자열을 value로 쓰면 Radix에서 경고/에러가 날 수 있어서
  //    "ALL" 같은 sentinel 값을 사용
  const [type, setType] = useState('ALL');
  const [brand, setBrand] = useState('ALL');

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
    queryFn: () =>
      fetchStatisticsBrands({
        type: type === 'ALL' ? '' : type,
      }),
    enabled: Boolean(type && type !== 'ALL'),
    staleTime: 60_000,
  });

  // 주종 바뀌면 브랜드 초기화
  useEffect(() => {
    setBrand('ALL');
  }, [type]);

  const statsQ = useQuery({
    queryKey: ['stats-inout', { from, to, debouncedKeyword, type, brand }],
    enabled: Boolean(from && to && !dateError),
    queryFn: () =>
      fetchStatisticsInOutByProduct({
        from,
        to,
        keyword: debouncedKeyword || undefined,
        type: type === 'ALL' ? undefined : type,
        brand: brand === 'ALL' ? undefined : brand,
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
      title='입출고 수량 합계 통계'
      description='기간/품목/주종/브랜드 기준 품목별 입출고 수량 합계'
      width='wide'
      height='lg'
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
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>품목 검색</label>
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='품목명/코드'
            className='h-9 w-44'
          />
        </div>

        {/*  주종 (shadcn Select) */}
        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>주종</label>

          <Select
            value={type}
            onValueChange={(v) => setType(v)}
          >
            <SelectTrigger className='h-9 w-28'>
              <SelectValue placeholder='전체' />
            </SelectTrigger>

            <SelectContent className='max-h-72'>
              <SelectItem value='ALL'>
                <span className='text-muted-foreground'>전체</span>
              </SelectItem>

              {(typesQ.data ?? []).map((t) => (
                <SelectItem
                  key={t}
                  value={String(t)}
                >
                  <div className='flex items-center justify-between gap-3 w-full'>
                    <span className='font-medium'>{toKoreanTypeLabel(t)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/*  브랜드 (shadcn Select) */}
        <div className='flex flex-col gap-1'>
          <label className='text-xs text-muted-foreground'>브랜드</label>

          <Select
            value={brand}
            onValueChange={(v) => setBrand(v)}
            disabled={type === 'ALL'}
          >
            <SelectTrigger className='h-9 w-44 disabled:opacity-60'>
              <SelectValue
                placeholder={type === 'ALL' ? '주종 선택 필수' : '전체'}
              />
            </SelectTrigger>

            <SelectContent className='max-h-72'>
              <SelectItem value='ALL'>
                <span className='text-muted-foreground'>
                  {type === 'ALL' ? '주종 선택 필수' : '전체'}
                </span>
              </SelectItem>

              {(brandsQ.data ?? []).map((b) => (
                <SelectItem
                  key={b}
                  value={String(b)}
                >
                  <div className='flex items-center justify-between gap-3 w-full'>
                    <span className='truncate font-medium'>{b}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {dateError ? (
        <div className='mb-2 text-sm font-semibold text-red-600'>
          {dateError}
        </div>
      ) : null}

      {statsQ.isFetching ? (
        <div className='w-full h-full flex justify-center items-center'>
          <ChartLoading />
        </div>
      ) : statsQ.isError ? (
        <div className='w-full h-full flex justify-center items-center text-sm text-destructive'>
          통계 조회 실패
        </div>
      ) : (
        <InOutboundChart data={chartData} />
      )}
    </GraphContainer>
  );
};
