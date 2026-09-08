// @ts-check
import { createContext, useContext, useMemo, useState } from 'react';

const Ctx = createContext(/** @type {HistoryContextValue | null} */ (null));

export function useHistoryCtx() {
  const v = useContext(Ctx);
  if (!v) throw new Error('HistoryProvider is missing');
  return v;
}

/** @param {Date} d */
function toYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** @param {{children: import('react').ReactNode}} props */
export function HistoryProvider({ children }) {
  const today = new Date();
  const todayYMD = toYMD(today);

  const from = new Date();
  from.setMonth(from.getMonth() - 1);

  const [range, setRange] = useState(() => ({
    from: toYMD(from),
    to: todayYMD,
  }));
  const [pick, setPick] = useState(/** @type {HistoryPick} */ ({}));
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('ALL');
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [selectedLotId, setSelectedLotId] = useState(
    /** @type {number|null} */ (null)
  );

  const value = useMemo(
    () => ({
      range,
      setRange,
      q,
      setQ,
      pick,
      setPick,
      status,
      setStatus,
      type,
      setType,
      brand,
      setBrand,
      selectedLotId,
      setSelectedLotId,
    }),
    [range, q, pick, status, type, brand, selectedLotId]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
