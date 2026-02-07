// @ts-check
import { useState, useMemo } from 'react';
import { useOutboundOverviewCtx } from '../providers/outbound-overview-provider.jsx';
import { OutboundDateRangePicker } from './outbound-date-range-picker.jsx';
import { OutboundPendingTable } from './outbound-pending-table.jsx';
import { OutboundCompletedTable } from './outbound-completed-table.jsx';
import { useOutboundAssignees } from '../hooks/use-outbound-assignees.js';
import { Button } from '@/components/ui/button.js';
import { OutboundStockCheckDialog } from './outbound-stock-check-dialog.jsx';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';

/** @param {Date} d */
function toYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * @param {(updater: any) => void} setSearch
 * @param {'today'|'tomorrow'} kind
 */
function applyQuickDay(setSearch, kind) {
  const base = new Date();
  if (kind === 'tomorrow') base.setDate(base.getDate() + 1);
  const ymd = toYMD(base);
  setSearch((prev) => ({ ...prev, from: ymd, to: ymd }));
}

export function OutboundOverviewScreen() {
  const { search, setSearch, pendingRows, completedRows, loading, error, setError } =
    useOutboundOverviewCtx();

  const [quickDay, setQuickDay] = useState('all');       
  const [assignee, setAssignee] = useState('all');   
  const [stockOpen, setStockOpen] = useState(false);
   

  const assigneesQ = useOutboundAssignees();
  const assignees = Array.isArray(assigneesQ.data) ? assigneesQ.data : [];

   console.log('assignees:', assigneesQ.data);
  const assigneeLabel = useMemo(() => {
    if (assignee === 'all') return '담당자(전체)';
    const idNum = Number(assignee);
    const u = assignees.find((x) => Number(x.id) === idNum);
    return u ? `${u.name}` : '담당자';
  }, [assignee, assignees]);

  const quickDayLabel = quickDay === 'all' ? '전체' : quickDay === 'today' ? '금일' : '명일';

  

  return (
    <div style={{ padding: 16 }}>
      <h2>출고 내역</h2>

      <div style={{ marginBottom: 10, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
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

        {/* 금일/명일 */}
        <Select
          value={quickDay}
          onValueChange={(v) => {
            setQuickDay(v);
            if (v === 'today') applyQuickDay(setSearch, 'today');
            else if (v === 'tomorrow') applyQuickDay(setSearch, 'tomorrow');
            else {
              setSearch((prev) => prev);
            }
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="전체">{quickDayLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="today">금일</SelectItem>
            <SelectItem value="tomorrow">명일</SelectItem>
          </SelectContent>
        </Select>
        {/* 담당자 */}
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
          
          <SelectTrigger className="w-40">
            <SelectValue placeholder="담당자(전체)">{assigneeLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">담당자(전체)</SelectItem>
            {assignees.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" onClick={() => setStockOpen(true)}>
          현재고 확인
        </Button>

      </div>

      {error ? <div style={{ color: 'crimson', marginBottom: 10 }}>{error}</div> : null}

      <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12 }}>
        <section style={{ border: '1px solid #ddd', borderRadius: 10 }}>
          <div style={{ padding: 12, fontWeight: 700 }}>출고 대기 내역</div>
          <div style={{ height: 380, overflow: 'auto', padding: 12, paddingTop: 0 }}>
            <OutboundPendingTable rows={pendingRows} loading={loading} error={error} onError={setError} />
          </div>
        </section>

        <section style={{ border: '1px solid #ddd', borderRadius: 10 }}>
          <div style={{ padding: 12, fontWeight: 700 }}>출고 완료 내역 (오늘)</div>
          <div style={{ height: 380, overflow: 'auto', padding: 12, paddingTop: 0 }}>
            <OutboundCompletedTable rows={completedRows} loading={loading} />
          </div>
        </section>
      </div>
      <OutboundStockCheckDialog open={stockOpen} onOpenChange={setStockOpen} />
    </div>
  );
}
