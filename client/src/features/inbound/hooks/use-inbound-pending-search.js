// @ts-check
import { useMemo, useState } from 'react';

/**
 * @typedef {Object} InboundPendingSearch
 * @property {string} from
 * @property {string} to
 * @property {string=} keyword
 * @property {number=} page
 * @property {number=} size
 */

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function useInboundPendingSearch() {
  const today = useMemo(() => new Date(), []);
  const todayYmd = useMemo(() => ymd(today), [today]);

  /** @type {[InboundPendingSearch, any]} */
  const [search, setSearch] = useState(() => ({
    from: todayYmd,
    to: todayYmd,
    keyword: '',
    page: 0,
    size: 50,
  }));

  /**
   * @param {{from:string,to:string}} next
   */
  function setRange(next) {
    setSearch((prev) => ({
      ...prev,
      from: next.from,
      to: next.to,
      page: 0,
    }));
  }

  return { search, setSearch, setRange };
}
