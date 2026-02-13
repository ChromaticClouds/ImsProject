// @ts-check
import { createContext, useContext, useMemo, useState } from 'react';

import { useInboundPendingSummary } from '../hooks/use-inbound-pending-summary';
import { useInboundCompletedTodaySummary } from '../hooks/use-inbound-completed-today-summary';

import { InboundPendingProvider } from './inbound-pending-provider';
import { InboundOverviewScreen } from '../components/inbound-overview-screen';

/**
 * @typedef {{ from: string, to: string }} DateRangeValue
 * @typedef {{
 *  pendingRows: any[],
 *  completedRows: any[],
 *  loading: boolean,
 *  error: string,
 *  setError: (msg: string) => void,
 * }} OverviewCtxValue
 */

const Ctx = createContext(/** @type {OverviewCtxValue | null} */ (null));

export function useInboundOverviewCtx() {
  const v = useContext(Ctx);
  if (!v) throw new Error('InboundOverviewProvider is missing');
  return v;
}

export function InboundOverviewProvider() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayYMD = `${yyyy}-${mm}-${dd}`;

  const fromDate = new Date(today);
  fromDate.setFullYear(fromDate.getFullYear() - 1);
  const fy = fromDate.getFullYear();
  const fm = String(fromDate.getMonth() + 1).padStart(2, '0');
  const fd = String(fromDate.getDate()).padStart(2, '0');
  const fromYMD = `${fy}-${fm}-${fd}`;

  const [search, setSearch] = useState(() => ({ from: fromYMD, to: todayYMD }));
  const [error, setError] = useState('');

  const pendingQ = useInboundPendingSummary({
    from: search.from,
    to: search.to,
    keyword: '',
    page: 0,
    size: 50,
  });

  const completedQ = useInboundCompletedTodaySummary({
    page: 0,
    size: 50,
    keyword: '',
  });

  const pendingRows = Array.isArray(pendingQ.data?.content) ? pendingQ.data.content : [];
  const completedRows = Array.isArray(completedQ.data?.content) ? completedQ.data.content : [];
  const loading = pendingQ.isFetching || completedQ.isFetching;

  const overviewValue = useMemo(
    () => ({ pendingRows, completedRows, loading, error, setError }),
    [pendingRows, completedRows, loading, error]
  );

  return (
    <InboundPendingProvider
      search={search}
      setSearch={setSearch}
      rows={pendingRows}
      loading={pendingQ.isFetching}
      error={error}
      setError={setError}
    >
      <Ctx.Provider value={overviewValue}>
        <InboundOverviewScreen />
      </Ctx.Provider>
    </InboundPendingProvider>
  );
}
