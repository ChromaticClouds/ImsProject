// @ts-check
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';

// ❌ 이 줄 삭제
// import { Alert, AlertDescription } from '@/components/ui/alert.js';

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
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div className="rounded-lg border bg-background p-4">
      {/* 🔥 에러 표시 (Alert 대신) */}
      {error ? (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-center py-2">상태</th>
            <th className="text-center py-2">입고 예정일</th>
            <th className="text-center py-2">발주 번호</th>
            <th className="text-center py-2">거래처</th>
            <th className="text-center py-2">품목 수</th>
            <th className="text-right py-2">단가 총액</th>
            <th className="text-center py-2">등록</th>
          </tr>
        </thead>

        <tbody>
          {safeRows.length ? (
            safeRows.map((row) => (
              <InboundOverviewPendingRow
                key={row.orderNumber}
                row={row}
                loading={loading}
                onError={onError}
              />
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-10 text-muted-foreground">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
