// @ts-check
import { createContext, useContext, useMemo, useState } from 'react';

import { useInboundPendingSearch } from '../hooks/use-inbound-pending-search';
import { useInboundPendingSummary } from '../hooks/use-inbound-pending-summary';

import { InboundPendingTable } from '../components/inbound-pending-table';
import { InboundPendingDateRangePicker } from '../components/inbound-pending-date-range-picker';

/**
 * @typedef {{ [orderNumber: string]: any[] }} ItemsMap
 */

const Ctx = createContext(null);

export function useInboundPendingCtx() {
  const v = useContext(Ctx);
  if (!v) throw new Error('InboundPendingProvider is missing');
  return v;
}

function InboundPendingScreen() {
  const { loading, rows, error, setError } = useInboundPendingCtx();

  return (
    <div style={{ padding: 16 }}>
      <h2>입고 대기 내역</h2>

  
      <div style={{ marginBottom: 10 }}>
        <InboundPendingDateRangePicker loading={loading} />
      </div>

      <InboundPendingTable
        rows={rows}
        loading={loading}
        error={error}
        onError={setError}
      />
    </div>
  );
}

export function InboundPendingProvider() {
  const [expanded, setExpanded] = useState(() => new Set());
  const [itemsMap, setItemsMap] = useState({});

  const { search, setSearch } = useInboundPendingSearch();
  const { data, isFetching } = useInboundPendingSummary(search);

  const [error, setError] = useState('');

  const rows = Array.isArray(data?.content) ? data.content : [];
  const pageInfo = data?.page;

  const value = useMemo(
    () => ({
      expanded,
      setExpanded,
      itemsMap,
      setItemsMap,
      search,
      setSearch,
      rows,
      pageInfo,
      loading: isFetching,
      error,
      setError,
    }),
    [expanded, itemsMap, search, setSearch, rows, pageInfo, isFetching, error]
  );

  return (
    <Ctx.Provider value={value}>
      <InboundPendingScreen />
    </Ctx.Provider>
  );
}
