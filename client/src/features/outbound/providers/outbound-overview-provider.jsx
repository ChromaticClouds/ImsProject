// @ts-check
import { createContext, useContext, useMemo, useState } from 'react';
import { OutboundOverviewScreen } from '../components/outbound-overview-screen.jsx';
import { useOutboundPendingSummary } from '../hooks/use-outbound-pending-summary.js';
import { useOutboundCompletedTodaySummary } from '../hooks/use-outbound-completed-today-summary.js';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';

const Ctx = createContext(null);

export function useOutboundOverviewCtx() {
  const v = useContext(Ctx);
  if (!v) throw new Error('OutboundOverviewProvider is missing');
  return v;
}

function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

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

export function OutboundOverviewProvider() {
  const t = todayYMD();

  // 기본 to: 1년 뒤 (기존 로직 유지)
  const toDate = new Date();
  toDate.setFullYear(toDate.getFullYear() + 1);

  const ty = toDate.getFullYear();
  const tm = String(toDate.getMonth() + 1).padStart(2, '0');
  const td = String(toDate.getDate()).padStart(2, '0');
  const toYMD = `${ty}-${tm}-${td}`;

  const [search, setSearch] = useState(() => ({ from: t, to: toYMD }));
  const [error, setError] = useState('');

  // ✅ 내 ID
  const accessToken = useAuthStore((s) => s.accessToken);
  const myId = useMemo(() => getMyUserIdFromToken(accessToken), [accessToken]);

  // 1) 화면 필터 적용된 출고 대기 목록 (기존 그대로)
  const pendingQ = useOutboundPendingSummary({ ...search, page: 0, size: 50 });

  // 2) 출고 완료(오늘) (기존 그대로)
  const completedQ = useOutboundCompletedTodaySummary({ page: 0, size: 50 });

  // 3) ⭐ "내 금일 출고 대기"는 필터 영향 없이 고정 조회
  const myTodayParams = useMemo(() => {
    if (myId == null) return null;
    return { from: t, to: t, userId: myId, page: 0, size: 9999 };
  }, [myId, t]);

  // 훅이 enabled 옵션이 없는 상태라면 더미 호출로 안전하게
  const myTodayPendingQ = useOutboundPendingSummary(
    myTodayParams ?? { from: t, to: t, page: 0, size: 0 }
  );

  const pendingRows = Array.isArray(pendingQ.data?.content) ? pendingQ.data.content : [];
  const completedRows = Array.isArray(completedQ.data?.content) ? completedQ.data.content : [];
  const myTodayPendingRows = Array.isArray(myTodayPendingQ.data?.content)
    ? myTodayPendingQ.data.content
    : [];

  const loading =
    pendingQ.isFetching || completedQ.isFetching || myTodayPendingQ.isFetching;

  const value = useMemo(
    () => ({
      search,
      setSearch,

      // 화면용(필터 적용)
      pendingRows,
      completedRows,

      // ⭐ 카운트 고정용(필터 미적용)
      myId,
      myTodayPendingRows,

      loading,
      error,
      setError,
    }),
    [search, pendingRows, completedRows, myId, myTodayPendingRows, loading, error]
  );

  return (
    <Ctx.Provider value={value}>
      <OutboundOverviewScreen />
    </Ctx.Provider>
  );
}
