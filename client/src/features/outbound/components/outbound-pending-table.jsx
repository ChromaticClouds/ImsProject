// @ts-check
import { OutboundPendingRow } from './outbound-pending-row.jsx';

/**
 * @param {{
 *  rows: any[],
 *  loading: boolean,
 *  error: string,
 *  onError?: (msg: string) => void
 * }} props
 */
export function OutboundPendingTable({ rows, loading, error, onError }) {
  const list = Array.isArray(rows) ? rows : [];

  const th =
    'sticky top-0 z-20 bg-background ' +
    'px-3 py-3 text-center text-xs font-semibold text-muted-foreground border-b';

  return (
    <div className="flex flex-col gap-2">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 whitespace-pre-wrap">
          {error}
        </div>
      ) : null}

      <table className="w-full text-sm border-separate border-spacing-0">
        <thead>
          <tr>
            <th className={`${th} w-[90px]`}>상태</th>
            <th className={`${th} w-[200px]`}>납기희망일</th>
            <th className={`${th} w-[200px]`}>수주번호</th>
            <th className={`${th} w-[140px]`}>판매처</th>
            <th className={`${th} w-[140px]`}>담당자</th>
            <th className={`${th} w-[180px]`}>품목 수</th>
            <th className={`${th} w-[120px] text-right`}>단가총액</th>
            <th className={`${th} w-[150px]`}>등록</th>
          </tr>
        </thead>

        <tbody>
          {list.length ? (
            list.map((row) => (
              <OutboundPendingRow
                key={row.orderNumber}
                row={row}
                loading={loading}
                onError={onError}
              />
            ))
          ) : (
            <tr>
              <td colSpan={8} className="h-24 text-center text-muted-foreground">
                데이터가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {loading ? <div className="text-sm text-muted-foreground">불러오는 중...</div> : null}
    </div>
  );
}
