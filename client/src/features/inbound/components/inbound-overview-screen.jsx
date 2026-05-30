// @ts-check
import { InboundDateRangePicker } from './inbound-date-range-picker';
import { InboundPendingTable } from './inbound-pending-table';
import { InboundCompletedTable } from './inbound-completed-table';

import { useInboundPendingCtx } from '../providers/inbound-pending-provider';
import { useInboundPendingSummary } from '../hooks/use-inbound-pending-summary';
import { useInboundCompletedTodaySummary } from '../hooks/use-inbound-completed-today-summary';
import { AppHeader } from '@/components/common/app-header.jsx';

export function InboundOverviewScreen() {
  const pending = useInboundPendingCtx();
  const pendingQ = useInboundPendingSummary({
    from: pending.search.from,
    to: pending.search.to,
    keyword: '',
    page: 0,
    size: 50,
  });
  const completedQ = useInboundCompletedTodaySummary({
    page: 0,
    size: 50,
    keyword: '',
  });

  const pendingRows = Array.isArray(pendingQ.data?.content)
    ? pendingQ.data.content
    : [];
  const completedRows = Array.isArray(completedQ.data?.content)
    ? completedQ.data.content
    : [];
  const loading = pendingQ.isFetching || completedQ.isFetching;

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

      {pending.error ? (
        <div style={{ color: 'crimson', marginBottom: 10 }}>{pending.error}</div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12 }}>
        <section className='bg-secondary shadow-xl rounded-xl'>
          <div className='p-4 font-bold'>입고 대기 내역</div>
          <div
            style={{
              height: 360,
              overflow: 'auto',
              paddingTop: 0,
            }}
          >
            <InboundPendingTable
              rows={pendingRows}
              loading={pendingQ.isFetching}
              error={pending.error}
              onError={pending.setError}
            />
          </div>
        </section>

        <section className='bg-secondary shadow-xl rounded-xl'>
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
              loading={completedQ.isFetching}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
