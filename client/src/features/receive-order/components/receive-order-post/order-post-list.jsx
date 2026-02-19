// @ts-check

/**
 * Components
 */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';

/**
 * Constants
 */
import { ORDER_POST_TABLE_HEADER } from '../../constants/index.js';
import { useOrderPostContext } from '../../providers/receive-order-post-provider.jsx';
import { AmountFieldCell } from './amount-field-cell.jsx';
import { CircleXIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';

export const OrderPostList = () => {
  const { form } = useOrderPostContext();

  return (
    <Table>
      <TableHeader>
        <TableRow className='bg-accent'>
          {ORDER_POST_TABLE_HEADER.map((col) => (
            <TableHead
              key={col.head}
              className={`text-center ${col.width}`}
            >
              {col.head}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <form.Field name='products'>
        {(field) => (
          <TableBody>
            {field.state.value.length > 0 ? (
              field.state.value.map(
                /** @param {OrderPostProduct & { amount: number }} product */
                (product, index) => (
                  <TableRow key={product.id}>
                    {/* 제품 */}
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        {/* 썸네일 */}
                        <Avatar className='w-10 h-10 rounded'>
                          <AvatarImage
                            src={product.imageUrl}
                            alt={product.name}
                            className='w-10 h-10 rounded object-cover shrink-0'
                          />
                          <AvatarFallback className='w-10 h-10 rounded' />
                        </Avatar>

                        {/* 텍스트 */}
                        <div className='flex flex-col min-w-0'>
                          <span className='text-sm font-medium truncate'>
                            {product.name}
                          </span>
                          <span className='text-xs text-muted-foreground truncate'>
                            {product.brand} · {product.type}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* 수량 */}
                    <AmountFieldCell
                      product={product}
                      index={index}
                    />

                    {/* 단가 */}
                    <TableCell className='text-center w-60'>
                      {product.salePrice * product.amount}원
                    </TableCell>

                    <TableCell className='w-20'>
                      <div className='w-full h-full flex justify-center items-center'>
                        <CircleXIcon
                          className='text-center cursor-pointer text-destructive'
                          onClick={() =>
                            field.handleChange((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ),
              )
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className='w-full h-24 flex justify-center items-center'>
                    <span className='text-muted-foreground'>등록한 품목이 없습니다.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </form.Field>
    </Table>
  );
};
