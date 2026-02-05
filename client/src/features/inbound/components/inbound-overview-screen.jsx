// @ts-check
import { InboundDateRangePicker } from './inbound-date-range-picker';
import { InboundPendingTable } from './inbound-pending-table';
import { InboundCompletedTable } from './inbound-completed-table';

import { useInboundPendingCtx } from '../providers/inbound-pending-provider';
import { useInboundOverviewCtx } from '../providers/inbound-overview-provider';

export function InboundOverviewScreen() {
  const pending = useInboundPendingCtx();
  const { completedRows, loading, error, setError } = useInboundOverviewCtx();

  return (
    <div style={{ padding: 16 }}>
      <h2>입고 현황</h2>

      <div style={{ marginBottom: 10 }}>
        <InboundDateRangePicker
          value={pending.search}
          onChange={pending.setSearch}
          disabled={loading}
        />
      </div>

      {error ? <div style={{ color: 'crimson', marginBottom: 10 }}>{error}</div> : null}

      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12 }}>
        <section style={{ border: '1px solid #ddd', borderRadius: 10, background: '#fff' }}>
          <div style={{ padding: 12, fontWeight: 700 }}>입고 대기 내역</div>
          <div style={{ height: 360, overflow: 'auto', padding: 12, paddingTop: 0 }}>
            <InboundPendingTable
              rows={pending.rows}
              loading={pending.loading}
              error={pending.error}
              onError={setError}
            />
          </div>
        </section>

        <section style={{ border: '1px solid #ddd', borderRadius: 10, background: '#fff' }}>
          <div style={{ padding: 12, fontWeight: 700 }}>입고 완료 내역 (오늘)</div>
          <div style={{ height: 360, overflow: 'auto', padding: 12, paddingTop: 0 }}>
            <InboundCompletedTable rows={completedRows} loading={loading} />
          </div>
        </section>
      </div>
    </div>
  );
}
