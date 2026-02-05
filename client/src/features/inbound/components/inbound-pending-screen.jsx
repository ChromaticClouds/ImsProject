// @ts-check
import { useInboundPendingCtx } from '../providers/inbound-pending-provider';
import { InboundDateRangePicker } from './inbound-date-range-picker';
import { InboundPendingTable } from './inbound-pending-table';

export function InboundPendingScreen() {
  const { search, setSearch, rows, loading, error, setError } = useInboundPendingCtx();

  return (
    <div style={{ padding: 16 }}>
      <h2>입고 대기 내역</h2>

      <div style={{ marginBottom: 10 }}>
        <InboundDateRangePicker
          value={search}
          onChange={setSearch}
          disabled={loading}
        />
      </div>

      {error ? <div style={{ color: 'crimson', marginBottom: 10 }}>{error}</div> : null}

      <InboundPendingTable
        rows={rows}
        loading={loading}
        error={error}
        onError={setError}
      />
    </div>
  );
}
