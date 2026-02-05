import { useState } from 'react';
import { Input } from '@/components/ui/input.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';

import { MOCK_ADJUST_LIST } from '../constants/index.js';
import { XIcon } from 'lucide-react';
import { CircleXIcon } from 'lucide-react';

const TABLE_HEADER = [
  '',
  '제품',
  '구매가',
  '판매가',
  '브랜드',
  '주종',
  '재고',
  '조정수량',
  '',
];

export const AdjustList = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow className='bg-border hover:bg-muted'>
          {TABLE_HEADER.map((v, i) => (
            <TableHead
              key={i}
              className='text-center'
            >
              {v}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {MOCK_ADJUST_LIST.map((row) => (
          <TableRow key={row.productId}>
            {/* 이미지 */}
            <TableCell>
              <div className='rounded-lg w-10 h-10 overflow-hidden'>
                <img
                  src={row.imageUrl}
                  className='w-full h-full object-cover'
                />
              </div>
            </TableCell>

            {/* 제품명 */}
            <TableCell className='text-center'>{row.productName}</TableCell>

            {/* 구매가 */}
            <TableCell className='text-center'>
              {row.purchasePrice.toLocaleString()}원
            </TableCell>

            {/* 판매가 */}
            <TableCell className='text-center'>
              {row.salePrice.toLocaleString()}원
            </TableCell>

            {/* 브랜드 */}
            <TableCell className='text-center'>{row.brand}</TableCell>

            {/* 주종 */}
            <TableCell className='text-center'>{row.category}</TableCell>

            {/* 현재 재고 */}
            <TableCell className='text-center'>{row.currentStock}</TableCell>

            {/* 조정 수량 입력 */}
            <TableCell className='text-center'>
              <Input
                defaultValue={0}
                value={MOCK_ADJUST_LIST.adjustQty}
                className='w-20 text-center'
              />
            </TableCell>

            {/* 결과 재고 (계산 컬럼) */}
            <TableCell className='text-center font-semibold'>
              <CircleXIcon
                size={20}
                className='text-destructive cursor-pointer'
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
