// @ts-check
import { Input } from '@/components/ui/input.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';
import { CircleXIcon } from 'lucide-react';
import { useAdjustContext } from '../providers/adjust-provider.jsx';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip.js';
import { FieldError } from '@/components/ui/field.js';

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

  return (
    <form.Field name='products'>
      {(productsField) => (
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
            {productsField.state.value.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className='h-24 text-center text-muted-foreground'
                >
                  품목 검색 후 등록해주세요.
                </TableCell>
              </TableRow>
            ) : (
              productsField.state.value.map((row, index) => (
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

                  <TableCell className='text-center'>{row.name}</TableCell>
                  <TableCell className='text-center'>
                    {row.purchasePrice}
                  </TableCell>
                  <TableCell className='text-center'>
                    {row.salePrice}원
                  </TableCell>
                  <TableCell className='text-center'>{row.brand}</TableCell>
                  <TableCell className='text-center'>{row.type}</TableCell>
                  <TableCell className='text-center'>
                    {row.currentStock}
                  </TableCell>

                  <form.Field name={`products[${index}].adjustCount`}>
                    {(countField) => {
                      const isInvalid =
                        countField.state.meta.isTouched &&
                        !countField.state.meta.isValid;

                      return (
                        <TableCell className='text-center'>
                          <Tooltip open>
                            <TooltipTrigger asChild>
                              <Input
                                value={countField.state.value ?? ''}
                                onChange={(e) => {
                                  countField.handleChange(
                                    Number(e.target.value) || 0,
                                  );
                                }}
                                aria-invalid={isInvalid}
                                className='w-20 text-center'
                              />
                            </TooltipTrigger>

                            {isInvalid && (
                              <TooltipContent className='bg-muted'>
                                <FieldError
                                  errors={countField.state.meta.errors}
                                />
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TableCell>
                      );
                    }}
                  </form.Field>

                  {/* 삭제 */}
                  <TableCell className='text-center font-semibold'>
                    <CircleXIcon
                      size={20}
                      className='text-destructive cursor-pointer'
                      onClick={() =>
                        productsField.handleChange((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </form.Field>
  );
};
