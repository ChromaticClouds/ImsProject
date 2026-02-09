// @ts-check
import { useState } from 'react';
import { InboundPendingProvider } from '@/features/inbound/providers/inbound-pending-provider';
import { InboundPendingScreen } from '@/features/inbound/components/inbound-pending-screen';
import { useInboundPendingSearch } from '@/features/inbound/hooks/use-inbound-pending-search';
import { useInboundPendingSummary } from '@/features/inbound/hooks/use-inbound-pending-summary';


export function InboundPending() {
  const { search, setRange } = useInboundPendingSearch();
  const q = useInboundPendingSummary(search);

  const [error, setError] = useState('');

  const rows = Array.isArray(q.data?.content) ? q.data.content : [];

  return (
    <InboundPendingProvider
      search={search}
      setSearch={setRange}
      rows={rows}
      loading={q.isFetching}
      error={error}
      setError={setError}
    >
      
      <InboundPendingScreen />
    </InboundPendingProvider>
  );
}
