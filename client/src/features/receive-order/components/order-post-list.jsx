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
import { ORDER_POST_TABLE_HEADER } from '../constants/index.js';
import { useOrderPostContext } from '../providers/receive-order-post-provider.jsx';
import { Input } from '@/components/ui/input.js';
import { AmountFieldCell } from './amount-field-cell.jsx';

export const OrderPostList = () => {
  const { form } = useOrderPostContext();

  return (
    <Table>
      <TableHeader>
        <TableRow className='bg-accent'>
          {ORDER_POST_TABLE_HEADER.map((head) => (
            <TableHead
              key={head}
              className='text-center'
            >
              {head}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <form.Field name='products'>
        {(field) => (
          <TableBody>
            {field.state.value.map(
              /** @param {OrderPostProduct & { amount: number }} product */
              (product, index) => (
                <TableRow key={product.id}>
                  {/* 제품 */}
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      {/* 썸네일 */}
                      <img
                        src={product.imageUrl || '/placeholder.png'}
                        alt={product.name}
                        className='w-10 h-10 rounded object-cover shrink-0'
                      />

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
                  <TableCell className='text-center'>
                    {product.salePrice.toLocaleString()}원
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        )}
      </form.Field>
    </Table>
  );
};
