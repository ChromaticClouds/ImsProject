// @ts-check
import { useMemo, useState } from 'react';
import { useOutboundOverviewCtx } from '../providers/outbound-overview-provider.jsx';
import { OutboundDateRangePicker } from './outbound-date-range-picker.jsx';
import { OutboundPendingTable } from './outbound-pending-table.jsx';
import { OutboundCompletedTable } from './outbound-completed-table.jsx';
import { OutboundStockCheckDialog } from './outbound-stock-check-dialog.jsx';
import { useOutboundAssignees } from '../hooks/use-outbound-assignees.js';
import { useOutboundPendingSummary } from '../hooks/use-outbound-pending-summary.js';
import { useOutboundCompletedTodaySummary } from '../hooks/use-outbound-completed-today-summary.js';
import { Button } from '@/components/ui/button.js';
import { AppHeader } from '@/components/common/app-header.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';

function toYMD(/** @type {Date} */ d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * @param {React.Dispatch<React.SetStateAction<import('../providers/outbound-overview-provider.jsx').OutboundSearch>>} setSearch
 * @param {'today' | 'tomorrow'} kind
 */
function applyQuickDay(setSearch, kind) {
  const base = new Date();
  if (kind === 'tomorrow') base.setDate(base.getDate() + 1);
  const ymd = toYMD(base);
  setSearch((prev) => ({ ...prev, from: ymd, to: ymd }));
}

export function OutboundOverviewScreen() {
  const { search, setSearch, myId, error, setError } = useOutboundOverviewCtx();
  const [quickDay, setQuickDay] = useState('today');
  const [assignee, setAssignee] = useState(() =>
    myId == null ? 'all' : String(myId),
  );
  const [stockOpen, setStockOpen] = useState(false);

  const assigneesQ = useOutboundAssignees();
  const assignees = useMemo(
    () => (Array.isArray(assigneesQ.data) ? assigneesQ.data : []),
    [assigneesQ.data],
  );

  const pendingQ = useOutboundPendingSummary({ ...search, page: 0, size: 50 });
  const completedQ = useOutboundCompletedTodaySummary({ page: 0, size: 50 });
  const today = useMemo(() => toYMD(new Date()), []);
  const myTodayParams = useMemo(() => {
    if (myId == null) return null;
    return { from: today, to: today, userId: myId, page: 0, size: 9999 };
  }, [myId, today]);
  const myTodayPendingQ = useOutboundPendingSummary(
    myTodayParams ?? { from: today, to: today, page: 0, size: 0 },
  );

  const pendingRows = Array.isArray(pendingQ.data?.content)
    ? pendingQ.data.content
    : [];
  const completedRows = Array.isArray(completedQ.data?.content)
    ? completedQ.data.content
    : [];
  const myTodayPendingRows = useMemo(
    () =>
      Array.isArray(myTodayPendingQ.data?.content)
        ? myTodayPendingQ.data.content
        : [],
    [myTodayPendingQ.data],
  );
  const loading =
    pendingQ.isFetching || completedQ.isFetching || myTodayPendingQ.isFetching;

  const assigneeLabel = useMemo(() => {
    if (assignee === 'all') return '담당자 전체';
    const idNum = Number(assignee);
    const user = assignees.find((x) => Number(x.id) === idNum);
    return user ? `${user.name}` : '담당자';
  }, [assignee, assignees]);

  const myTodayPendingCount = useMemo(() => {
    if (myId == null) return 0;
    return myTodayPendingRows.length;
  }, [myId, myTodayPendingRows]);

  return (
    <div style={{ padding: 16 }}>
      <AppHeader
        title='출고 이력'
        description='출고 이력을 확인하세요.'
      />

      <div
        style={{
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <OutboundDateRangePicker
            value={search}
            onChange={(next) => {
              setQuickDay('all');
              setSearch((prev) => ({
                ...prev,
                from: next.from,
                to: next.to,
              }));
            }}
            disabled={loading}
          />

          <Select
            value={quickDay}
            onValueChange={(v) => {
              setQuickDay(v);
              if (v === 'today') applyQuickDay(setSearch, 'today');
              else if (v === 'tomorrow') applyQuickDay(setSearch, 'tomorrow');
              else setSearch((prev) => prev);
            }}
          >
            <SelectTrigger className='w-32'>
              <SelectValue placeholder='전체'>
                {quickDay === 'today'
                  ? '금일'
                  : quickDay === 'tomorrow'
                    ? '명일'
                    : '전체'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>전체</SelectItem>
              <SelectItem value='today'>금일</SelectItem>
              <SelectItem value='tomorrow'>명일</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={assignee}
            onValueChange={(v) => {
              setAssignee(v);
              if (v === 'all') {
                setSearch((prev) => {
                  const next = { ...prev };
                  delete next.userId;
                  return next;
                });
                return;
              }
              setSearch((prev) => ({ ...prev, userId: Number(v) }));
            }}
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='담당자 전체'>
                {assigneeLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>담당자 전체</SelectItem>
              {assignees.map((u) => (
                <SelectItem
                  key={u.id}
                  value={String(u.id)}
                >
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type='button'
            variant='outline'
            onClick={() => setStockOpen(true)}
          >
            재고 확인
          </Button>
        </div>

        <div className='flex items-center'>
          <span className='inline-flex items-center rounded-full border bg-muted/40 px-3 py-1.5 text-sm font-semibold shadow-sm'>
            금일 출고 대기
            <span className='ml-1 text-primary tabular-nums'>
              {myTodayPendingCount}
            </span>
            건
          </span>
        </div>
      </div>

      {error ? (
        <div style={{ color: 'crimson', marginBottom: 10 }}>{error}</div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12 }}>
        <section className='bg-secondary shadow-xl rounded-xl'>
          <div className='p-4 font-bold'>출고 대기 이력</div>
          <div style={{ height: 380, overflow: 'auto', paddingTop: 0 }}>
            <OutboundPendingTable
              rows={pendingRows}
              loading={pendingQ.isFetching}
              error={error}
              onError={setError}
            />
          </div>
        </section>

        <section className='bg-secondary shadow-xl rounded-xl'>
          <div className='p-4 font-bold'>출고 완료 이력 (오늘)</div>
          <div
            style={{
              height: 380,
              overflow: 'auto',
              paddingTop: 0,
              position: 'relative',
            }}
          >
            <OutboundCompletedTable
              rows={completedRows}
              loading={completedQ.isFetching}
            />
          </div>
        </section>
      </div>

      <OutboundStockCheckDialog
        open={stockOpen}
        onOpenChange={setStockOpen}
      />
    </div>
  );
}
