

// @ts-check
import { useHistoryCtx } from '../providers/history-provider.jsx';
import { HistoryDateRangePicker } from './history-date-range-picker.jsx';
import { HistorySearchBox } from './history-search-box.jsx';
import { HistoryFilters } from './history-filters.jsx';
import { HistoryLotList } from './history-lot-list.jsx';
import { HistoryDetailPanel } from './history-detail-panel.jsx';

export function HistoryScreen() {
  const {
    range,
    setRange,
    minDateYMD,
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
    rows,
    loading,
    selectedLotId,
    setSelectedLotId,
    error,
  } = useHistoryCtx();

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

        <HistorySearchBox q={q} setQ={setQ} pick={pick} setPick={setPick} />

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