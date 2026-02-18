// @ts-check
import {
  ArrowBigDownDashIcon,
  ArrowBigUpDashIcon,
  ArrowDownUpIcon,
} from 'lucide-react';

/** @param {any} row */
function getIcon(row) {
  if (row.status === 'INBOUND')
    return (
      <ArrowBigDownDashIcon
        size={18}
        className='text-blue-500'
      />
    );
  if (row.status === 'OUTBOUND')
    return (
      <ArrowBigUpDashIcon
        size={18}
        className='text-red-500'
      />
    );
  return (
    <ArrowDownUpIcon
      size={18}
      className='text-green-500'
    />
  );
}

function deltaStyle(status, n) {
  if (status === 'INBOUND') return { fontWeight: 800 };
  if (status === 'OUTBOUND') return { fontWeight: 800 };
  return { fontWeight: 800 };
}

function formatDelta(status, totalDelta) {
  const n = Number(totalDelta ?? 0);
  if (status === 'OUTBOUND') return `-${Math.abs(n)}`;
  if (status === 'INBOUND') return `${Math.abs(n)}`;
  return n >= 0 ? `${n}` : `${n}`;
}

export function HistoryLotList({ rows, selectedLotId, onSelect }) {
  return (
    <div
      style={{
        borderRight: '1px solid #ddd',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <div
        // style={{ padding: 10, fontWeight: 800, borderBottom: '1px solid #ddd' }}
        className='sticky top-0 bg-background border-b p-3'
      >
        거래일순
      </div>

      {rows.length === 0 ? (
        <div style={{ padding: 12, color: '#666', fontSize: 12 }}>
          데이터 없음
        </div>
      ) : (
        rows.map((r) => {
          const active = Number(selectedLotId) === Number(r.lotId);
          const deltaText = formatDelta(r.status, r.totalDelta);
          const vendorText =
            r.status === 'INBOUND'
              ? r.vendorName
              : r.status === 'OUTBOUND'
                ? r.sellerVendorName
                : '';

          return (
            <button
              key={r.lotId}
              onClick={() => onSelect(Number(r.lotId))}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: 12,
                border: 'none',
                borderBottom: '1px solid #eee',
                //background: active ? '#eef6ff' : '#fff',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {getIcon(r)}
                  <b>{r.statusText}</b>
                </div>
                <div style={{ fontSize: 12 }}>{r.createdAt ?? '-'}</div>
              </div>

              <div
                style={{
                  marginTop: 6,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontSize: 12 }}>{r.userName ?? '-'}</div>
                <div style={{ fontSize: 12 }}>
                  <b>{r.itemCount ?? 0}개 품목</b> /{' '}
                  <span style={deltaStyle(r.status, r.totalDelta)}>
                    {deltaText}
                  </span>
                </div>
              </div>

              {vendorText ? (
                <div style={{ marginTop: 6, fontSize: 12 }}>{vendorText}</div>
              ) : null}
            </button>
          );
        })
      )}
    </div>
  );
}
