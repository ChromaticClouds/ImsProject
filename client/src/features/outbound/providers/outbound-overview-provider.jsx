// @ts-check
import { createContext, useContext, useMemo, useState } from 'react';
import { OutboundOverviewScreen } from '../components/outbound-overview-screen.jsx';
import { useOutboundPendingSummary } from '../hooks/use-outbound-pending-summary.js';
import { useOutboundCompletedTodaySummary } from '../hooks/use-outbound-completed-today-summary.js';

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

export function OutboundOverviewProvider() {
  
  const t = todayYMD();

  const toDate = new Date();
  toDate.setFullYear(toDate.getFullYear() + 1);

  const ty = toDate.getFullYear();
  const tm = String(toDate.getMonth() + 1).padStart(2, '0');
  const td = String(toDate.getDate()).padStart(2, '0');
  const toYMD = `${ty}-${tm}-${td}`;

  const [search, setSearch] = useState(() => ({ from: t, to: toYMD }));

  const pendingQ = useOutboundPendingSummary({ ...search, page: 0, size: 50 });
  const completedQ = useOutboundCompletedTodaySummary({ page: 0, size: 50 });

  const [error, setError] = useState('');

  const pendingRows = Array.isArray(pendingQ.data?.content) ? pendingQ.data.content : [];
  const completedRows = Array.isArray(completedQ.data?.content) ? completedQ.data.content : [];

  const loading = pendingQ.isFetching || completedQ.isFetching;

  const value = useMemo(
    () => ({
      search,
      setSearch,
      pendingRows,
      completedRows,
      loading,
      error,
      setError,
    }),
    [search, pendingRows, completedRows, loading, error]
  );

  return (
    <Ctx.Provider value={value}>
      <OutboundOverviewScreen />
    </Ctx.Provider>
  );
}
