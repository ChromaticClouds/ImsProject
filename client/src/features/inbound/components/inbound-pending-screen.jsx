// @ts-check
import { useInboundPendingCtx } from '../providers/inbound-pending-provider';
import { useInboundPendingSummary } from '../hooks/use-inbound-pending-summary';
import { InboundDateRangePicker } from './inbound-date-range-picker';
import { InboundPendingTable } from './inbound-pending-table';

export function InboundPendingScreen() {
  const { search, setSearch, error, setError } = useInboundPendingCtx();
  const q = useInboundPendingSummary(search);
  const rows = Array.isArray(q.data?.content) ? q.data.content : [];

  return (
    <div style={{ padding: 16 }}>
      <h2>입고 대기 내역</h2>

      <div style={{ marginBottom: 10 }}>
        <InboundDateRangePicker
          value={search}
          onChange={setSearch}
          disabled={q.isFetching}
        />
      </div>

      {error ? <div style={{ color: 'crimson', marginBottom: 10 }}>{error}</div> : null}

      <InboundPendingTable
        rows={rows}
        loading={q.isFetching}
        error={error}
        onError={setError}
      />
    </div>
  );
}
