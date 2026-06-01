// @ts-check
import { useState } from 'react';
import { InboundPendingProvider } from '@/features/inbound/providers/inbound-pending-provider';
import { InboundPendingScreen } from '@/features/inbound/components/inbound-pending-screen';
import { useInboundPendingSearch } from '@/features/inbound/hooks/use-inbound-pending-search';


export function InboundPending() {
  const { search, setRange } = useInboundPendingSearch();
  const [error, setError] = useState('');

  return (
    <InboundPendingProvider
      search={search}
      setSearch={setRange}
      error={error}
      setError={setError}
    >
      
      <InboundPendingScreen />
    </InboundPendingProvider>
  );
}
