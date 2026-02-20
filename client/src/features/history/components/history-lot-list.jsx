
// @ts-check
import {
  ArrowBigDownDashIcon,
  ArrowBigUpDashIcon,
  ArrowDownUpIcon,
} from 'lucide-react';

/** @param {any} row */
function getIcon(row) {
  if (row.status === 'INBOUND') {
    return <ArrowBigDownDashIcon size={18} className="text-blue-500" />;
  }
  if (row.status === 'OUTBOUND') {
    return <ArrowBigUpDashIcon size={18} className="text-red-500" />;
  }
  return <ArrowDownUpIcon size={18} className="text-green-500" />;
}

function deltaStyle() {
  return { fontWeight: 800 };
}

function formatDelta(status, totalDelta) {
  const n = Number(totalDelta ?? 0);
  if (status === 'OUTBOUND') return `-${Math.abs(n)}`;
  if (status === 'INBOUND') return `${Math.abs(n)}`;
  return `${n}`;
}

export function HistoryLotList({ rows, selectedLotId, onSelect }) {
  return (
    
    <div className="h-full overflow-auto border-r border-border/40">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-background border-b border-border p-3 font-extrabold">
        거래일순
      </div>

      {rows.length === 0 ? (
        <div className="bg-secondary text-muted-foreground p-4 text-sm">
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
              className={`
                w-full text-left p-3 cursor-pointer
                border-b border-border
                transition-colors
                ${active ? 'bg-secondary' : 'bg-background hover:bg-muted/40'}
              `}
            >
              {/* 1줄 */}
              <div className="flex justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getIcon(r)}
                  <b className="text-foreground">{r.statusText}</b>
                </div>
                <div className="text-xs text-muted-foreground">
                  {r.createdAt ?? '-'}
                </div>
              </div>

              {/* 2줄 */}
              <div className="mt-1.5 flex justify-between">
                <div className="text-xs text-muted-foreground">
                  {r.userName ?? '-'}
                </div>
                <div className="text-xs">
                  <b>{r.itemCount ?? 0}개 품목</b> /{' '}
                  <span style={deltaStyle()}>
                    {deltaText}
                  </span>
                </div>
              </div>

              {/* 거래처 */}
              {vendorText ? (
                <div className="mt-1.5 text-xs text-muted-foreground">
                  {vendorText}
                </div>
              ) : null}
            </button>
          );
        })
      )}
    </div>
  );
}