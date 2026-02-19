// @ts-check
import { InboundDateRangePicker } from './inbound-date-range-picker';
import { InboundPendingTable } from './inbound-pending-table';
import { InboundCompletedTable } from './inbound-completed-table';

import { useInboundPendingCtx } from '../providers/inbound-pending-provider';
import { useInboundOverviewCtx } from '../providers/inbound-overview-provider';
import { AppHeader } from '@/components/common/app-header.jsx';

export function InboundOverviewScreen() {
  const pending = useInboundPendingCtx();
  const { completedRows, loading, error, setError } = useInboundOverviewCtx();

  return (
    <div style={{ padding: 16 }}>
      <AppHeader
        title='입고 내역'
        description='입고 내역을 확인하세요'
      />
      <div style={{ marginBottom: 10 }}>
        <InboundDateRangePicker
          value={pending.search}
          onChange={pending.setSearch}
          disabled={loading}
        />
      </div>

      {error ? (
        <div style={{ color: 'crimson', marginBottom: 10 }}>{error}</div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12 }}>
        <section className='bg-card shadow-xl rounded-xl'>
          <div className='p-4 font-bold'>입고 대기 내역</div>
          <div
            style={{
              height: 360,
              overflow: 'auto',
              paddingTop: 0,
            }}
          >
            <InboundPendingTable
              rows={pending.rows}
              loading={pending.loading}
              error={pending.error}
              onError={setError}
            />
          </div>
        </section>

        <section className='bg-card shadow-xl rounded-xl'>
          <div className='p-4 font-bold'>
            금일 입고 완료 내역
          </div>
          <div
            style={{
              height: 360,
              overflow: 'auto',
              paddingTop: 0,
              position: 'relative',
            }}
          >
            <InboundCompletedTable
              rows={completedRows}
              loading={loading}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
