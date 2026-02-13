// @ts-check
import { InboundCompletedRow } from './inbound-completed-row';

/**
 * @param {{
 *  rows: any[],
 *  loading: boolean
 * }} props
 */
export function InboundCompletedTable({ rows, loading }) {
  return (
    <table>
      <thead>
        <tr>
          <th>상태</th>
          <th>발주일</th>
          <th>발주번호</th>
          <th>거래처</th>
          <th>품목수</th>
          <th>단가 총액</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <InboundCompletedRow key={row.orderNumber} row={row} loading={loading} />
        ))}
        {!rows.length ? (
          <tr>
            <td colSpan={6} style={{ padding: 12, textAlign: 'center', color: '#666' }}>
              데이터가 없습니다.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}

const th = {
  textAlign: 'left',
  padding: 8,
  borderBottom: '1px solid #eee',
  fontSize: 12,
  color: '#666',
};
