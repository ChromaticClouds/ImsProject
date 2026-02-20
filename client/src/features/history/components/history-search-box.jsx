// @ts-check
import { useEffect, useMemo, useState } from 'react';
import { useHistorySearch } from '../hooks/use-history-search.js';

export function HistorySearchBox({ q, setQ, pick, setPick }) {
  const [open, setOpen] = useState(false);

  const searchQ = useHistorySearch(q, open);
  const items = Array.isArray(searchQ.data) ? searchQ.data : [];

  useEffect(() => {
    if (!q) setOpen(false);
    else setOpen(true);
  }, [q]);

  const label = pick?.label ? `${pick.label}` : '';

  return (
    <div style={{ position: 'relative', width: 280 }}>
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
          padding: '8px 10px',
          outline: 'none',
          fontSize: '13px',
          lineHeight: '13px'
        }} className='bg-secondary border border-border'
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
      />

      {open && q && (
        <div style={{
          position: 'absolute', zIndex: 20, top: 40, left: 0, right: 0,
           borderRadius: 8,
          overflow: 'hidden'
        }} className='bg-secondary'>
          {searchQ.isFetching ? (
            <div style={{ padding: 10, fontSize: 12, color: '#666' }}>검색 중...</div>
          ) : items.length === 0 ? (
            <div style={{ padding: 10, fontSize: 12, color: '#666' }}>결과 없음</div>
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
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setPick({ kind: it.kind, targetId: Number(it.id), label: `${it.label}` });
                  setQ(''); 
                  setOpen(false);
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700 }}>{it.label}</div>
                <div style={{ fontSize: 11, color: '#666' }}>
                  {it.kind === 'PRODUCT' ? '제품' : it.kind === 'USER' ? '담당자' : '거래처'}
                </div>
              </button>
            ))
          )}
        </div>
      )}

    </div>
  );
}