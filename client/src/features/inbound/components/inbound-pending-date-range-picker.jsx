// @ts-check
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useInboundPendingCtx } from '../providers/inbound-pending-provider';
import { formatDateYMD, parseYMD, isOverOneYear } from '../hooks/dateRange';

/** @param {Date} d */
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** @param {Date} a @param {Date} b */
function diffDaysInclusive(a, b) {
  const A = startOfDay(a).getTime();
  const B = startOfDay(b).getTime();
  const diff = Math.floor((B - A) / (24 * 60 * 60 * 1000));
  return diff + 1; 
}

/** @param {Date} d */
function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d.getTime());
}

export function InboundPendingDateRangePicker({ loading }) {
  const { search, setSearch } = useInboundPendingCtx();

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const [limitError, setLimitError] = useState('');

  // URL 값 → 초기 range
  const urlRange = useMemo(() => {
    const from = search.from ? parseYMD(search.from) : undefined;
    const to = search.to ? parseYMD(search.to) : undefined;
    if (!from || !to || !isValidDate(from) || !isValidDate(to)) return undefined;
    return { from, to };
  }, [search.from, search.to]);

  // 
  const [draft, setDraft] = useState(urlRange);

  // 팝업 열 때 URL 범위로 draft 초기화
  useEffect(() => {
    if (open) {
      setDraft(urlRange);
      setLimitError('');
    }
  }, [open, urlRange]);

  // 
  useEffect(() => {
    if (!open) return;

    /** @param {MouseEvent} e */
    const onDown = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      if (el.contains(/** @type {any} */ (e.target))) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  /** @param {Date} day */
  const onDayClick = (day) => {
    setLimitError('');

    const clicked = startOfDay(day);
    const curFrom = draft?.from ? startOfDay(draft.from) : undefined;
    const curTo = draft?.to ? startOfDay(draft.to) : undefined;

    // 1) 아직 시작이 없으면 시작 설정
    if (!curFrom) {
      setDraft({ from: clicked, to: undefined });
      return;
    }

    // 2) 시작만 있고 종료가 없으면: 종료 설정
    if (curFrom && !curTo) {
      const nextFrom = clicked < curFrom ? clicked : curFrom;
      const nextTo = clicked < curFrom ? curFrom : clicked;

      if (isOverOneYear(nextFrom, nextTo)) {
        setLimitError('날짜 설정 범위 한도 초과입니다.');
        return;
      }

      setDraft({ from: nextFrom, to: nextTo });

      
      setSearch({
        from: formatDateYMD(nextFrom),
        to: formatDateYMD(nextTo),
        page: 0,
      });

      setOpen(false);
      return;
    }

    // 3) 이미 from/to가 다 있는 상태면:
    setDraft({ from: clicked, to: undefined });
  };

  const label = `${search.from} ~ ${search.to}`;

  const periodText = useMemo(() => {
    if (draft?.from && !draft?.to) return '종료일을 선택하세요';
    return '';
  }, [draft]);

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button type="button" onClick={() => setOpen((v) => !v)} disabled={loading}>
        {loading ? '로딩...' : label}
      </button>

      {open ? (
        <div
          style={{
            position: 'absolute',
            zIndex: 50,
            marginTop: 8,
            padding: 12,
            border: '1px solid #ddd',
            borderRadius: 10,
            background: '#fff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          }}
        >
          
          <DayPicker
            mode="range"
            numberOfMonths={1}
            selected={draft}
            onDayClick={onDayClick}
          />

          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            {periodText}
          </div>

          {limitError ? (
            <div style={{ marginTop: 6, color: 'crimson', fontSize: 12 }}>
              {limitError}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
