// @ts-check

/**
 * Components
 */
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card.js';
import { BottleWineIcon } from 'lucide-react';
import { VendorProductListFooter } from './vendor-product-list-footer.jsx';
import { VendorProductListRow } from './vendor-product-list-row.jsx';

/**
 * @import { useVendorEditForm } from '@/features/vendor/hooks/vendor-edit/use-vendor-edit-form.js';
 * @import { VendorProductType } from '@/features/vendor/types/index.js';
 */

/**
 * @typedef {object} VendorProductListProps
 * @property {ReturnType<typeof useVendorEditForm>} form
 * @property {VendorProductType[]} items
 * @property {(index: number) => void} onRemove
 */

/**
 * @param {VendorProductListProps} props
 */
export const VendorProductList = ({ form, items = [], onRemove }) => {
  const hasNoItems = items.length === 0;
  const hasMissingPrice = items.some((item) => !item.purchasePrice);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.purchasePrice ?? 0),
    0,
  );

  return (
    <Card className='gap-0 rounded-md p-0'>
      <CardHeader className='m-0! gap-0 border-b p-3!'>
        <div className='grid grid-cols-[36px_minmax(0,1fr)_128px_36px] items-center gap-2.5 sm:grid-cols-[36px_minmax(0,1fr)_160px_36px]'>
          <span />
          <p className='text-xs font-medium text-muted-foreground'>품목</p>
          <p className='text-right text-xs font-medium text-muted-foreground'>
            구매 단가
          </p>
          <span className='sr-only'>삭제</span>
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        {hasNoItems ? (
          <div className='flex h-28 flex-col items-center justify-center gap-1.5 text-muted-foreground'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg border'>
              <BottleWineIcon
                className='size-5'
                aria-hidden='true'
              />
            </div>
            <p className='text-sm'>검색창에서 품목을 추가하세요.</p>
          </div>
        ) : (
          <div className='divide-y'>
            {items.map((item, index) => (
              <VendorProductListRow
                key={item.productId}
                form={form}
                item={item}
                index={index}
                onRemove={() => onRemove(index)}
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className='flex-wrap items-center justify-between gap-2 border-t p-3!'>
        <VendorProductListFooter
          hasNoItems={hasNoItems}
          hasMissingPrice={hasMissingPrice}
          itemCount={items.length}
          totalPrice={totalPrice}
        />
      </CardFooter>
    </Card>
  );
};
