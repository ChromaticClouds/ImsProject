
// @ts-check
import { useEffect, useMemo, useState } from 'react';
import { useOutboundOverviewCtx } from '../providers/outbound-overview-provider.jsx';
import { OutboundDateRangePicker } from './outbound-date-range-picker.jsx';
import { OutboundPendingTable } from './outbound-pending-table.jsx';
import { OutboundCompletedTable } from './outbound-completed-table.jsx';
import { useOutboundAssignees } from '../hooks/use-outbound-assignees.js';
import { Button } from '@/components/ui/button.js';
import { OutboundStockCheckDialog } from './outbound-stock-check-dialog.jsx';
import { AppHeader } from '@/components/common/app-header.jsx';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';

import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';

function decodeJwtPayload(token) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length < 2) return null;
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getMyUserIdFromToken(token) {
  const p = decodeJwtPayload(token);
  if (!p) return null;
  if (p.id != null && !Number.isNaN(Number(p.id))) return Number(p.id);
  if (p.userId != null && !Number.isNaN(Number(p.userId))) return Number(p.userId);
  if (p.sub != null && !Number.isNaN(Number(p.sub))) return Number(p.sub);
  return null;
}

function toYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function applyQuickDay(setSearch, kind) {
  const base = new Date();
  if (kind === 'tomorrow') base.setDate(base.getDate() + 1);
  const ymd = toYMD(base);
  setSearch((prev) => ({ ...prev, from: ymd, to: ymd }));
}

export function OutboundOverviewScreen() {
  const { search, setSearch, pendingRows, completedRows, loading, error, setError } =
    useOutboundOverviewCtx();

  const accessToken = useAuthStore((s) => s.accessToken);
  const myId = useMemo(() => getMyUserIdFromToken(accessToken), [accessToken]);

  const [quickDay, setQuickDay] = useState('today');
  const [assignee, setAssignee] = useState('all');
  const [stockOpen, setStockOpen] = useState(false);

  const assigneesQ = useOutboundAssignees();
  const assignees = Array.isArray(assigneesQ.data) ? assigneesQ.data : [];

  useEffect(() => {
    setQuickDay('today');
    applyQuickDay(setSearch, 'today');

    if (myId != null) {
      setAssignee(String(myId));
      setSearch((prev) => ({ ...prev, userId: Number(myId) }));
    } else {
      setAssignee('all');
      setSearch((prev) => {
        const next = { ...prev };
        delete next.userId;
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  const assigneeLabel = useMemo(() => {
    if (assignee === 'all') return '담당자(전체)';
    const idNum = Number(assignee);
    const u = assignees.find((x) => Number(x.id) === idNum);
    return u ? `${u.name}` : '담당자';
  }, [assignee, assignees]);

  const todayYmd = useMemo(() => toYMD(new Date()), []);

  const myTodayPendingCount = useMemo(() => {
    if (!Array.isArray(pendingRows) || myId == null) return 0;

    return pendingRows.filter((r) => {
      const managerId = r?.managerId == null ? null : Number(r.managerId);
      const isMine = managerId != null && managerId === myId;
      const ymd = String(r?.receiveDate ?? '').slice(0, 10);
      const isToday = ymd === todayYmd;
      return isMine && isToday;
    }).length;
  }, [pendingRows, myId, todayYmd]);

  return (
    <div style={{ padding: 16 }}>
      <AppHeader title="출고 내역" description="출고 내역을 확인하세요" />

      {/* ⭐ 핵심: 좌측 필터 / 우측 카운트 분리 */}
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
        {/* 좌측 컨트롤 그룹 */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
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
            <SelectTrigger className="w-32">
              <SelectValue placeholder="전체">
                {quickDay === 'today' ? '금일' : quickDay === 'tomorrow' ? '명일' : '전체'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="today">금일</SelectItem>
              <SelectItem value="tomorrow">명일</SelectItem>
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

        {/* ⭐ 맨 오른쪽 고정 영역 (요청한 위치) */}
        <div className="flex items-center">
          <span className="inline-flex items-center rounded-full border bg-muted/40 px-3 py-1.5 text-sm font-semibold shadow-sm">
            내 금일 출고 대기&nbsp;
            <span className="ml-1 text-primary tabular-nums">
              {myTodayPendingCount}
            </span>
            건
          </span>
        </div>
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
