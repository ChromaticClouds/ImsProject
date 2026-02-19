/**
 * Components
 */
import { CardContent } from '@/components/ui/card.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.js';

/**
 * Constants
 */
import { PURCHASE_ORDER_TABLE_HEADER } from '../../constants/index.js';

/**
 * Hooks
 */
import { usePoFormContext } from '../../providers/po-post-form-provder.jsx';
import { Input } from '@/components/ui/input.js';
import { CircleXIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';

export const ToPurchaseProductList = () => {
  const form = usePoFormContext();

  return (
    <form.Subscribe selector={(state) => state.values.products}>
      {(products) => {
        return (
          <CardContent className='p-0'>
            <Table noWrapper>
              <TableHeader>
                <TableRow>
                  {PURCHASE_ORDER_TABLE_HEADER.map((h) => (
                    <TableHead
                      key={h.head}
                      className={`${h.width} text-center bg-accent`}
                    >
                      {h.head}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='h-24 text-muted-foreground'
                    >
                      <div className='flex items-center justify-center'>
                        <span>품목을 등록해주세요.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product, index) => (
                    <TableRow key={`${product.id}-${index}`}>
                      <TableCell className='text-center w-100'>
                        <div className='flex items-center gap-6'>
                          <Avatar className='rounded w-10 h-10'>
                            <AvatarImage
                              src={product.imageUrl}
                              alt={product.name}
                            />
                            <AvatarFallback>
                              {product.name?.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          {product.name}
                        </div>
                      </TableCell>

                      <TableCell className='text-center w-20'>
                        <form.Field name={`products[${index}].count`}>
                          {(countField) => {
                            const isInvalid =
                              countField.state.meta.isTouched &&
                              !countField.state.meta.isValid;

                            return (
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
                                  <TooltipContent className='bg-muted border'>
                                    <p className='text-destructive'>
                                      {countField.state.meta.errors[0]?.message}
                                    </p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            );
                          }}
                        </form.Field>
                      </TableCell>

                      <TableCell className='text-center w-30'>
                        {product.salePrice?.toLocaleString() ?? '-'}
                      </TableCell>

                      <TableCell className='text-destructive'>
                        <CircleXIcon
                          size={18}
                          className='cursor-pointer'
                          onClick={() => {
                            const current =
                              form.getFieldValue('products') ?? [];

                            form.setFieldValue(
                              'products',
                              current.filter((_, i) => i !== index),
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        );
      }}
    </form.Subscribe>
  );
};
