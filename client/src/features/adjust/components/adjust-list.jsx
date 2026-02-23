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
import { CircleXIcon } from 'lucide-react';
import { useAdjustContext } from '../providers/adjust-provider.jsx';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip.js';
import { FieldError } from '@/components/ui/field.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import { typeMap } from '@/constants/product-type.js';

const TABLE_HEADER = [
  '',
  '제품',
  '구매가',
  '판매가',
  '브랜드',
  '주종',
  '재고',
  '변동 수량',
  '',
];

export const AdjustList = () => {
  const { form } = useAdjustContext();

  return (
    <div className='max-h-120 overflow-y-auto'>
      <form.Field name='products'>
        {(productsField) => (
          <Table noWrapper>
            <TableHeader>
              <TableRow>
                {TABLE_HEADER.map((v, i) => (
                  <TableHead
                    key={i}
                    className='text-center bg-accent sticky top-0 z-10'
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
                      <Avatar className='w-14 h-14 rounded-lg'>
                        <AvatarImage
                          src={row.imageUrl}
                          alt={row.name}
                          className='object-cover'
                        />
                        <AvatarFallback className='rounded-lg text-xs'>
                          {row.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell className='text-center'>{row.name}</TableCell>
                    <TableCell className='text-center'>
                      {row.purchasePrice?.toLocaleString()}원
                    </TableCell>
                    <TableCell className='text-center'>
                      {row.salePrice?.toLocaleString()}원
                    </TableCell>
                    <TableCell className='text-center'>{row.brand}</TableCell>
                    <TableCell className='text-center'>{typeMap[row.type]}</TableCell>
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
    </div>
  );
};
