// @ts-check
import { useState } from 'react';
import { InboundPendingProvider } from './inbound-pending-provider';
import { InboundOverviewScreen } from '../components/inbound-overview-screen';

function ymd(/** @type {Date} */ d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function InboundOverviewProvider() {
  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setFullYear(fromDate.getFullYear() - 1);

  const [search, setSearch] = useState(() => ({
    from: ymd(fromDate),
    to: ymd(today),
  }));
  const [error, setError] = useState('');

  return (
    <InboundPendingProvider
      search={search}
      setSearch={setSearch}
      error={error}
      setError={setError}
    >
      <InboundOverviewScreen />
    </InboundPendingProvider>
  );
}
