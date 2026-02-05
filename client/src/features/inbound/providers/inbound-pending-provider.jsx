// @ts-check
import { createContext, useContext, useMemo, useState } from 'react';

/**
 * @typedef {Object} DateRangeValue
 * @property {string} from
 * @property {string} to
 */

/**
 * @typedef {Object.<string, any[]>} ItemsMap
 */

/**
 * @typedef {Object} PendingCtxValue
 * @property {Set<string>} expanded
 * @property {(next: Set<string>) => void} setExpanded
 * @property {ItemsMap} itemsMap
 * @property {(updater: (prev: ItemsMap) => ItemsMap) => void} setItemsMap
 *
 * @property {DateRangeValue} search
 * @property {(next: DateRangeValue) => void} setSearch
 *
 * @property {any[]} rows
 * @property {boolean} loading
 * @property {string} error
 * @property {(msg: string) => void} setError
 */

const Ctx = createContext(/** @type {PendingCtxValue | null} */ (null));

export function useInboundPendingCtx() {
  const v = useContext(Ctx);
  if (!v) throw new Error('InboundPendingProvider is missing');
  return v;
}

/**
 * @param {{
 *  children: any,
 *  search: DateRangeValue,
 *  setSearch: (next: DateRangeValue) => void,
 *  rows: any[],
 *  loading: boolean,
 *  error: string,
 *  setError: (msg: string) => void,
 * }} props
 */
export function InboundPendingProvider({
  children,
  search,
  setSearch,
  rows,
  loading,
  error,
  setError,
}) {
  const [expanded, setExpanded] = useState(() => new Set());
  const [itemsMap, setItemsMap] = useState(/** @type {ItemsMap} */ ({}));

  const value = useMemo(
    () => ({
      expanded,
      setExpanded,
      itemsMap,
      setItemsMap,
      search,
      setSearch,
      rows,
      loading,
      error,
      setError,
    }),
    [expanded, itemsMap, search, setSearch, rows, loading, error]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
