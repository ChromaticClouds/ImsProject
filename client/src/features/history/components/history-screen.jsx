// @ts-check
import { useHistoryCtx } from '../providers/history-provider.jsx';
import { HistoryDateRangePicker } from './history-date-range-picker.jsx';
import { HistorySearchBox } from './history-search-box.jsx';
import { HistoryFilters } from './history-filters.jsx';
import { HistoryLotList } from './history-lot-list.jsx';
import { HistoryDetailPanel } from './history-detail-panel.jsx';


export function HistoryScreen() {
  const {
    range, setRange,
    minDateYMD,
    q, setQ,
    pick, setPick,
    status, setStatus,
    type, setType,
    brand, setBrand,
    rows, loading,
    selectedLotId, setSelectedLotId,
    error,
  } = useHistoryCtx();

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <HistoryDateRangePicker value={range} onChange={setRange} disabled={loading} minDateYMD={minDateYMD} />

        <HistorySearchBox q={q} setQ={setQ} pick={pick} setPick={setPick} />

        <HistoryFilters
          status={status} setStatus={setStatus}
          type={type} setType={setType}
          brand={brand} setBrand={setBrand}
        />
      </div>

      {error ? <div style={{ marginTop: 10, color: 'crimson' }}>{error}</div> : null}

      <div style={{
        marginTop: 12,
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        border: '1px solid #ddd',
        borderRadius: 12,
        overflow: 'hidden',
        height: 560,
        background: '#fff'
      }}>
        <HistoryLotList rows={rows} selectedLotId={selectedLotId} onSelect={setSelectedLotId} />
        <HistoryDetailPanel lotId={selectedLotId} />
      </div>
    </div>
  );
}
