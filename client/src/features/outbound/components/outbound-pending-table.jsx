// // @ts-check
// import { OutboundPendingRow } from './outbound-pending-row.jsx';

// /**
//  * @param {{
//  *  rows: any[],
//  *  loading: boolean,
//  *  error: string,
//  *  onError: (msg: string) => void
//  * }} props
//  */
// export function OutboundPendingTable({ rows, loading, error, onError }) {
//   if (loading) return <div>로딩...</div>;
//   if (error) return null;

//   return (
//     <table style={{ width: '100%', border: '1px solid #ddd' }}>
//       <thead>
//         <tr>
//           <th style={{ textAlign: 'left', padding: 8 }}>상태</th>
//           <th style={{ textAlign: 'left', padding: 8 }}>납기희망일</th>
//           <th style={{ textAlign: 'left', padding: 8 }}>수주번호</th>
//           <th style={{ textAlign: 'left', padding: 8 }}>판매처</th>
//           <th style={{ textAlign: 'right', padding: 8 }}>품목 수</th>
//           <th style={{ textAlign: 'right', padding: 8 }}>단가총액</th>
//           <th style={{ textAlign: 'right', padding: 8 }}>출고담당자</th>
//           <th style={{ textAlign: 'right', padding: 8 }}>등록</th>
//         </tr>
//       </thead>
//       <tbody>
//         {rows.map((r) => (
//           <OutboundPendingRow key={r.orderNumber} row={r} loading={loading} onError={onError} />
//         ))}
//         {!rows.length ? (
//           <tr>
//             <td colSpan={7} style={{ padding: 12, textAlign: 'center', color: '#666' }}>
//               데이터 없음
//             </td>
//           </tr>
//         ) : null}
//       </tbody>
//     </table>
//   );
// }

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

  return (
    <>
      {error ? (
        <div style={{ color: 'red', marginBottom: 12, whiteSpace: 'pre-wrap' }}>{error}</div>
      ) : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #999' }}>
        <thead>
          <tr>
            <th>상태</th>
            <th>납기희망일</th>
            <th>수주번호</th>
            <th>판매처</th>
            <th>담당자</th>
            <th>품목 수</th>
            <th>금액</th>
            <th>등록</th>
          </tr>
        </thead>

        <tbody>
          {list.length ? (
            list.map((row) => (
              <OutboundPendingRow key={row.orderNumber} row={row} loading={loading} onError={onError} />
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center' }}>
                데이터가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

