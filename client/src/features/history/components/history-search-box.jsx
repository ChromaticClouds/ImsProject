
// @ts-check
import { useEffect, useState } from 'react';
import { useHistorySearch } from '../hooks/use-history-search.js';

/**
 * @param {{
 *  q: string,
 *  setQ: (v: string) => void,
 *  pick: any,
 *  setPick: (v: any) => void,
 *  onClear?: () => void,
 * }} props
 */
export function HistorySearchBox({ q, setQ, pick, setPick, onClear }) {
  const [open, setOpen] = useState(false);

  const searchQ = useHistorySearch(q, open);
  const items = Array.isArray(searchQ.data) ? searchQ.data : [];

  const hasPick = !!(pick && pick.kind && pick.targetId);

  useEffect(() => {
    if (!q) setOpen(false);
    else setOpen(true);
  }, [q]);

  const clearPick = () => {
    setQ('');
    setPick({});
    setOpen(false);
    onClear?.();
  };

  return (
    <div style={{ position: 'relative', width: 280 }}>
      <div style={{ position: 'relative' }}>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPick({});
          }}
          placeholder="제품명/등록자/거래처 검색 입력"
          style={{
            width: '100%',
            borderRadius: 8,
            padding: hasPick ? '8px 34px 8px 10px' : '8px 10px',
            outline: 'none',
            fontSize: '13px',
            lineHeight: '13px',
          }}
          className="bg-secondary border border-border"
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
        />

        {hasPick ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={clearPick}
            aria-label="선택 해제"
            title="선택 해제"
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 22,
              height: 22,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
            }}
            className="bg-muted text-muted-foreground hover:bg-muted/80"
          >
            ×
          </button>
        ) : null}
      </div>

      {open && q && (
        <div
          style={{
            position: 'absolute',
            zIndex: 20,
            top: 40,
            left: 0,
            right: 0,
            borderRadius: 8,
            overflow: 'hidden',
          }}
          className="bg-secondary border border-border"
        >
          {searchQ.isFetching ? (
            <div style={{ padding: 10, fontSize: 12, color: '#666' }}>
              검색 중...
            </div>
          ) : items.length === 0 ? (
            <div style={{ padding: 10, fontSize: 12, color: '#666' }}>
              결과 없음
            </div>
          ) : (
            items.map((it, idx) => (
              <button
                key={`${it.kind}-${it.id}-${idx}`}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                className="hover:bg-muted/40"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setPick({
                    kind: it.kind,
                    targetId: Number(it.id),
                    label: `${it.label}`,
                  });
                  setQ('');
                  setOpen(false);
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700 }}>{it.label}</div>
                <div style={{ fontSize: 11, color: '#666' }}>
                  {it.kind === 'PRODUCT'
                    ? '제품'
                    : it.kind === 'USER'
                    ? '담당자'
                    : '거래처'}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}