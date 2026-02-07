// @ts-check
import { OutboundCompletedRow } from './outbound-completed-row.jsx';

export function OutboundCompletedTable({ rows, loading }) {
  if (loading) return <div>로딩...</div>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: 8 }}>상태</th>
          <th style={{ textAlign: 'left', padding: 8 }}>출고완료일</th>
          <th style={{ textAlign: 'left', padding: 8 }}>수주번호</th>
          <th style={{ textAlign: 'left', padding: 8 }}>판매처</th>
          <th style={{ textAlign: 'right', padding: 8 }}>품목 수</th>
          <th style={{ textAlign: 'right', padding: 8 }}>총액</th>
          <th style={{ textAlign: 'right', padding: 8 }}>출고담당자</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <OutboundCompletedRow key={r.orderNumber} row={r} loading={loading} />
        ))}
        {!rows.length ? (
          <tr>
            <td colSpan={6} style={{ padding: 12, textAlign: 'center', color: '#666' }}>
              데이터 없음
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}
