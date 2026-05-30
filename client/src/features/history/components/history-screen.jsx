// @ts-check
import { useEffect, useMemo } from 'react';
import { useHistoryCtx } from '../providers/history-provider.jsx';
import { useHistoryLots } from '../hooks/use-history-lots.js';
import { useHistoryMinDate } from '../hooks/use-history-min-date.js';
import { HistoryDateRangePicker } from './history-date-range-picker.jsx';
import { HistorySearchBox } from './history-search-box.jsx';
import { HistoryFilters } from './history-filters.jsx';
import { HistoryLotList } from './history-lot-list.jsx';
import { HistoryDetailPanel } from './history-detail-panel.jsx';

export function HistoryScreen() {
  const {
    range,
    setRange,
    q,
    setQ,
    pick,
    setPick,
    status,
    setStatus,
    type,
    setType,
    brand,
    setBrand,
    selectedLotId,
    setSelectedLotId,
  } = useHistoryCtx();

  const minQ = useHistoryMinDate(true);
  const minDateYMD = minQ.data?.minDate ?? '';

  const todayYMD = useMemo(() => toYMD(new Date()), []);
  const defaultFromYMD = useMemo(() => {
    const from = new Date();
    from.setMonth(from.getMonth() - 1);
    return toYMD(from);
  }, []);

  useEffect(() => {
    if (!minDateYMD) return;

    setRange((prev) => {
      const isDefaultMonthRange =
        prev.from === defaultFromYMD && prev.to === todayYMD;

      if (!isDefaultMonthRange) return prev;
      return { from: minDateYMD, to: todayYMD };
    });
  }, [defaultFromYMD, minDateYMD, setRange, todayYMD]);

  const lotsQ = useHistoryLots({
    from: range.from,
    to: range.to,
    q: q || undefined,
    kind: pick.kind,
    targetId: pick.targetId,
    status: status === 'ALL' ? undefined : status,
    type: type || undefined,
    brand: brand || undefined,
    page: 0,
    size: 200,
  });

  const rows = Array.isArray(lotsQ.data?.content) ? lotsQ.data.content : [];
  const loading = lotsQ.isFetching;
  const error = lotsQ.error
    ? String(lotsQ.error?.message || lotsQ.error)
    : '';

  const resetToDefault = () => {
    
    setQ('');
    setPick({});

    
    const first = Array.isArray(rows) && rows.length ? Number(rows[0].lotId) : null;
    setSelectedLotId(first);
  };

  return (
    <div className="space-y-3">
      {/* 상단 필터 바 */}
      <div className="flex flex-wrap items-center gap-2">
        <HistoryDateRangePicker
          value={range}
          onChange={setRange}
          disabled={loading}
          minDateYMD={minDateYMD}
        />

        <HistorySearchBox
          q={q}
          setQ={setQ}
          pick={pick}
          setPick={setPick}
          onClear={resetToDefault}
        />

        <HistoryFilters
          status={status}
          setStatus={setStatus}
          type={type}
          setType={setType}
          brand={brand}
          setBrand={setBrand}
        />
      </div>

      {/* 에러 */}
      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive whitespace-pre-wrap">
          {error}
        </div>
      ) : null}

      {/* 본문(좌/우) */}
      <div
        className="
          grid grid-cols-[360px_1fr]
          rounded-xl overflow-hidden
          h-[560px]
          bg-background border border-border
        "
      >
        <HistoryLotList
          rows={rows}
          selectedLotId={selectedLotId}
          onSelect={setSelectedLotId}
        />
        <HistoryDetailPanel lotId={selectedLotId} />
      </div>
    </div>
  );
}

/** @param {Date} d */
function toYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
