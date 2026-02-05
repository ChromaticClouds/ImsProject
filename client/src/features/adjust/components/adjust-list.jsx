// @ts-check

/**
 * Components
 */
import { Input } from '@/components/ui/input.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';

/**
 * Assets
 */
import { CircleXIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useAdjustListStore } from '@/features/adjust/stores/use-adjust-list-store.js';
import { useAdjustContext } from '@/features/adjust/providers/adjust-form-provider.jsx';

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
  const form = useAdjustContext();

  const { products, removeProduct, changeAdjustCount } = useAdjustListStore();

  return (
    <form.Field name='products'>
      {(field) => (
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
            {products.length > 0 ? (
              products?.map((row) => (
                <TableRow key={row.id}>
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
                  <TableCell className='text-center'>{row.name}</TableCell>

                  {/* 구매가 */}
                  <TableCell className='text-center'>
                    {row.purchasePrice}
                  </TableCell>

                  {/* 판매가 */}
                  <TableCell className='text-center'>
                    {row.salePrice}원
                  </TableCell>

                  {/* 브랜드 */}
                  <TableCell className='text-center'>{row.brand}</TableCell>

                  {/* 주종 */}
                  <TableCell className='text-center'>{row.type}</TableCell>

                  {/* 현재 재고 */}
                  <TableCell className='text-center'>
                    {row.currentStock}
                  </TableCell>

                  {/* 조정 수량 입력 */}
                  <TableCell className='text-center'>
                    <Input
                      value={row.adjustCount}
                      onChange={(e) =>
                        changeAdjustCount(row.id, Number(e.target.value) || 1)
                      }
                      className='w-20 text-center'
                    />
                  </TableCell>

                  {/* 항목 삭제 버튼 */}
                  <TableCell className='text-center font-semibold'>
                    <CircleXIcon
                      size={20}
                      className='text-destructive cursor-pointer'
                      onClick={() => removeProduct(row.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className='h-24 text-center text-muted-foreground'
                >
                  품목 검색 후 등록해주세요.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </form.Field>
  );
};
