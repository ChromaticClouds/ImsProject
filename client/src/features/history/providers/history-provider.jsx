// @ts-check
import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useHistoryLots } from '../hooks/use-history-lots.js';
import { useHistoryMinDate } from '../hooks/use-history-min-date.js';

const Ctx = createContext(null);

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

export function HistoryProvider({ children }) {
  // 오늘
  const today = new Date();
  const todayYMD = toYMD(today);

  const from = new Date();
  from.setMonth(from.getMonth() - 1);

  const [range, setRange] = useState(() => ({ from: toYMD(from), to: todayYMD }));

  const minQ = useHistoryMinDate(true);
  const minDateYMD = minQ.data?.minDate ?? '';

  useEffect(() => {
    if (!minDateYMD) return;

    setRange((prev) => {
      
      const isDefaultMonthRange = prev.from === toYMD(from) && prev.to === todayYMD;
      if (!isDefaultMonthRange) return prev;

      return { from: minDateYMD, to: todayYMD };
    });
    
  }, [minDateYMD, todayYMD]);

  // 검색
  const [pick, setPick] = useState(() => /** @type {{ kind?: string, targetId?: number, label?: string }} */ ({}));
  const [q, setQ] = useState('');

  // 필터
  const [status, setStatus] = useState('ALL');
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');

  const [selectedLotId, setSelectedLotId] = useState(/** @type {number|null} */ (null));

  const lotsQ = useHistoryLots({
    from: range.from,
    to: range.to,
    q: q || undefined,
    kind: pick.kind,
    targetId: pick.targetId,
    status: status === 'ALL' ? undefined : status,
    type: type || undefined,
    brand: brand || undefined,
    page: 0,
    size: 200,
  });

  const rows = Array.isArray(lotsQ.data?.content) ? lotsQ.data.content : [];

  const value = useMemo(() => ({
    range, setRange,
    
    minDateYMD,

    q, setQ,
    pick, setPick,
    status, setStatus,
    type, setType,
    brand, setBrand,
    selectedLotId, setSelectedLotId,
    rows,
    loading: lotsQ.isFetching,
    error: lotsQ.error ? String(lotsQ.error?.message || lotsQ.error) : '',
  }), [range, minDateYMD, q, pick, status, type, brand, selectedLotId, rows, lotsQ.isFetching, lotsQ.error]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
