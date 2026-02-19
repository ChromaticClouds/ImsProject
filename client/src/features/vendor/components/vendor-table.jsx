
// @ts-check

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

/**
 * @param {{ vendors: Vendor[], onRowClick: (id: number) => void }} props
 */
export const VendorTable = ({ vendors, onRowClick }) => {
  return (
    <div className="rounded-2xl border bg-secondary">
      <Table>
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="w-[120px] px-8 text-left text-xs font-semibold text-muted-foreground">
              구분
            </TableHead>
            <TableHead className="w-[220px] px-25 text-left text-xs font-semibold text-muted-foreground">
              거래처명
            </TableHead>
            <TableHead className="w-[180px] px-20 text-left text-xs font-semibold text-muted-foreground">
              전화번호
            </TableHead>
            <TableHead className="w-[220px] px-30 text-left text-xs font-semibold text-muted-foreground">
              이메일
            </TableHead>
            <TableHead className="px-25 text-left text-xs font-semibold text-muted-foreground">
              주소
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {vendors.length ? (
            vendors.map((v) => (
              <TableRow
                key={v.id}
                onClick={() => onRowClick(v.id)}
                className="h-14 cursor-pointer transition-colors hover:bg-muted/40"
              >
                {/* 구분 */}
                <TableCell className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
                      v.type === 'Supplier'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {v.type === 'Supplier' ? '공급처' : '판매처'}
                  </span>
                </TableCell>

                {/* 거래처명 */}
                <TableCell className="px-4 py-3 font-medium" style={{display: 'flex', justifyContent: 'center'}}>
                  {v.vendorName ?? '-'}
                </TableCell>

                {/* 전화번호 */}
                <TableCell className="px-15 py-3 text-muted-foreground">
                  {v.telephone ?? '-'}
                </TableCell>

                {/* 이메일 */}
                <TableCell className="px-20 py-3 text-muted-foreground">
                  {v.email ?? '-'}
                </TableCell>

                {/* 주소 */}
                <TableCell className="px-15 py-3 text-muted-foreground">
                  {v.address ?? '-'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="h-20">
              <TableCell
                colSpan={5}
                className="px-4 text-center text-sm text-muted-foreground"
              >
                등록된 거래처가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
