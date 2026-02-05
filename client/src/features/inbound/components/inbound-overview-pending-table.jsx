// @ts-check
import { InboundOverviewPendingRow } from './inbound-overview-pending-row';

/**
 * @param {{
 *  rows: any[],
 *  loading?: boolean,
 *  error?: string,
 *  onError?: (msg: string) => void
 * }} props
 */
export function InboundOverviewPendingTable({ rows, loading = false, error = '', onError }) {
  return (
    <div>
      {error ? <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div> : null}

      <table
        width="100%"
        cellPadding="6"
        style={{ borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            <th>상태</th>
            <th>입고 예정일</th>
            <th>발주 번호</th>
            <th>거래처</th>
            <th>품목 수</th>
            <th>단가 총액</th>
            <th>수정</th>
            <th>등록</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rows) && rows.length ? (
            rows.map((row) => (
              <InboundOverviewPendingRow
                key={row.orderNumber}
                row={row}
                loading={loading}
                onError={onError}
              />
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: 12 }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
