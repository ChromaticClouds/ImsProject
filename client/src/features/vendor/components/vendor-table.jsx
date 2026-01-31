// @ts-check

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * @param {{ vendors: Vendor[], onRowClick: (id: number) => void }} props 
 * @returns 
 */
export const VendorTable = ({ vendors, onRowClick }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>구분</TableHead>
          <TableHead>거래처명</TableHead>
          <TableHead>전화번호</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>주소</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendors.map((v) => (
          <TableRow key={v.id} onClick={() => onRowClick(v.id)}>
            <TableCell>{v.type === 'Supplier' ? '공급처' : '판매처'}</TableCell>
            <TableCell>{v.vendorName ?? '-'}</TableCell>
            <TableCell>{v.telephone ?? '-'}</TableCell>
            <TableCell>{v.email ?? '-'}</TableCell>
            <TableCell>{v.address ?? '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
