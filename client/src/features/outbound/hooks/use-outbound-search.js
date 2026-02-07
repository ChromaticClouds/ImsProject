// @ts-check
import { useMemo, useState } from 'react';

/**
 * @typedef {{ from: string, to: string }} DateRangeValue
 */

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function useOutboundSearch() {
  const today = useMemo(() => new Date(), []);

  const to = useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30), [today]);

  const [search, setSearch] = useState(() => ({
    from: ymd(today),
    to: ymd(to),
  }));

  return { search, setSearch };
}
