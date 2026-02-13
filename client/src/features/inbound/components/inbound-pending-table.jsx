// @ts-check
import { InboundPendingRow } from './inbound-pending-row';
import { Button } from '@/components/ui/button';

/**
 * @param {{
 *  rows: import('../types').InboundPendingRow[],
 *  loading: boolean,
 *  error: string,
 *  onError?: (msg: string) => void
 * }} props
 */
export function InboundPendingTable({ rows, loading, error, onError }) {
  const list = Array.isArray(rows) ? rows : [];

  return (
    <>
      {error ? (
        <div style={{ color: 'red', marginBottom: 12, whiteSpace: 'pre-wrap' }}>{error}</div>
      ) : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #999' }}>
        <thead>
          <tr>
            <th>상태</th>
            <th>입고 예정일</th>
            <th>발주번호</th>
            <th>공급처</th>
            <th>품목 수</th>
            <th>단가 총액</th>
            <th>수정</th>
            <th>등록</th>
          </tr>
        </thead>

        <tbody>
          {list.length ? (
            list.map((row) => (
              <InboundPendingRow
                key={row.orderNumber}
                row={row}
                loading={loading}
                onError={onError}
              />
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>
                데이터가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
