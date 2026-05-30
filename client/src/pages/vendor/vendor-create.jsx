// @ts-check
import { useNavigate } from 'react-router-dom';
import { useVendorCreateForm } from '@/features/vendor/hooks/use-vendor-create-form';
import { useVendorCreateItems } from '@/features/vendor/hooks/use-vendor-create-items';
import { useVendorCreateSubmit } from '@/features/vendor/hooks/use-vendor-create-submit';
import { VendorCreateHeader } from '@/features/vendor/components/vendor-create/vendor-create-header.jsx';
import { VendorTypeSection } from '@/features/vendor/components/vendor-create/vendor-type-section.jsx';
import { VendorBasicInfoSection } from '@/features/vendor/components/vendor-create/vendor-basic-info-section.jsx';
import { VendorItemsSection } from '@/features/vendor/components/vendor-create/vendor-items-section.jsx';
import { VendorCreateActionsCard } from '@/features/vendor/components/vendor-create/vendor-create-actions-card.jsx';

export const VendorCreate = () => {
  const navigate = useNavigate();
  const {
    form,
    touched,
    errors,
    isSupplier,
    isValidRequired,
    setField,
    setType,
    markTouched,
    touchRequired,
  } = useVendorCreateForm();

  const itemsState = useVendorCreateItems({ enabled: isSupplier });

  const { onSubmit, isPending, error } = useVendorCreateSubmit({
    form,
    selectedItems: itemsState.selectedItems,
    isValidRequired,
    isValidItemsForSupplier: itemsState.isValidItemsForSupplier,
    touchRequired,
  });

  const canSubmit =
    isValidRequired && itemsState.isValidItemsForSupplier && !isPending;

  const onChangeType = (/** @type {'Seller' | 'Supplier'} */ type) => {
    setType(type);
    if (type === 'Seller') itemsState.resetItems();
  };

  return (
    <div className='min-h-[calc(100vh-64px)] bg-muted/40'>
      <div className='mx-auto max-w-300 px-5 py-6'>
        <VendorCreateHeader
          type={form.type}
          isPending={isPending}
        />

        {error ? (
          <div className='mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
            등록 실패: {error.message}
          </div>
        ) : null}

        <form
          onSubmit={onSubmit}
          className='grid grid-cols-12 gap-4'
          id='vendor-create-form'
        >
          <div className='col-span-12 lg:col-span-7 space-y-4'>
            <VendorTypeSection
              type={form.type}
              onChangeType={onChangeType}
            />

            <VendorBasicInfoSection
              form={form}
              touched={touched}
              errors={errors}
              setField={setField}
              markTouched={markTouched}
            />
          </div>

          <div className='col-span-12 lg:col-span-5'>
            <div className='sticky top-5 space-y-4'>
              <VendorItemsSection
                isSupplier={isSupplier}
                itemsState={itemsState}
              />

              <VendorCreateActionsCard
                canSubmit={canSubmit}
                isPending={isPending}
                onCancel={() => navigate(-1)}
              />
            </div>
          </div>
        </form>

        <div className='h-8' />
      </div>
    </div>
  );
};
