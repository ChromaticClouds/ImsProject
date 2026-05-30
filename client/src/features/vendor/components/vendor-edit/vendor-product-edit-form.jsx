// @ts-check

/**
 * Components
 */
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field.js';
import { VendorProductList } from './vendor-product-list.jsx';
import { VendorProductSearch } from './vendor-product-search.jsx';
import { useParams } from 'react-router-dom';
import { LockKeyholeIcon } from 'lucide-react';

/**
 * @import { useVendorEditForm } from '@/features/vendor/hooks/vendor-edit/use-vendor-edit-form.js';
 * @import { VendorProductType } from '@/features/vendor/types/index.js';
 *
 * @param {{ form: ReturnType<typeof useVendorEditForm> }} props
 */
export const VendorProductEditForm = ({ form }) => {
  const { id } = useParams();
  const vendorId = Number(id);

  return (
    <FieldSet>
      <FieldLegend className='text-xl! font-bold'>품목 / 구매 단가</FieldLegend>
      <FieldDescription>공급처일 때만 사용합니다.</FieldDescription>
      <FieldSeparator />

      <FieldGroup>
        <form.Subscribe selector={(state) => state.values.type}>
          {(vendorType) => {
            if (vendorType === 'Seller') {
              return (
                <div className='flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-4 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100'>
                  <div className='flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white'>
                    <LockKeyholeIcon
                      className='size-4'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium'>
                      판매처는 품목 / 구매 단가를 설정하지 않습니다.
                    </p>
                    <p className='mt-1 text-xs text-emerald-700 dark:text-emerald-300'>
                      거래처 구분이 판매처인 경우 해당 설정은 비활성화됩니다.
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <form.Field
                name='items'
                mode='array'
              >
                {(productsField) => {
                  const products = productsField.state.value ?? [];
                  const selectedIds = new Set(
                    products.map((item) => item.productId),
                  );

                  const handleToggle = (
                    /** @type {VendorProductType} */ result,
                  ) => {
                    const selectedIndex = products.findIndex(
                      (item) => item.productId === result.productId,
                    );

                    if (selectedIndex >= 0) {
                      productsField.removeValue(selectedIndex);
                      return;
                    }

                    productsField.pushValue({
                      productId: result.productId,
                      productName: result.productName,
                      brand: result.brand,
                      type: result.type,
                      purchasePrice: Math.max(
                        Number(result.purchasePrice ?? 0),
                        1,
                      ),
                      imageUrl: result.imageUrl,
                    });
                  };

                  return (
                    <>
                      <VendorProductSearch
                        currentVendorId={
                          Number.isFinite(vendorId) ? vendorId : undefined
                        }
                        selectedIds={selectedIds}
                        onToggle={handleToggle}
                      />

                      <VendorProductList
                        form={form}
                        items={products}
                        onRemove={(index) => productsField.removeValue(index)}
                      />
                    </>
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>
      </FieldGroup>
    </FieldSet>
  );
};
