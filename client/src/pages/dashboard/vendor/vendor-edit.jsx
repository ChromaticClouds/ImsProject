// @ts-check

import React from 'react';

/**
 * Components
 */
import { AppHeader } from '@/components/common/app-header.jsx';
import { VendorBaseEditForm } from '@/features/vendor/components/vendor-edit/vendor-base-edit-form.jsx';
import { VendorProductEditForm } from '@/features/vendor/components/vendor-edit/vendor-product-edit-form.jsx';
import { VendorEditSkeleton } from '@/features/vendor/components/vendor-edit/vendor-edit-skeleton.jsx';
import { VendorEditEmptyState } from '@/features/vendor/components/vendor-edit/vendor-edit-empty-state.jsx';
import { VendorEditAction } from '@/features/vendor/components/vendor-edit/vendor-edit-action.jsx';

/**
 * Hooks
 */
import { useVendorEditForm } from '@/features/vendor/hooks/vendor-edit/use-vendor-edit-form.js';
import { useParams } from 'react-router-dom';
import { useVendorDetail } from '@/features/vendor/hooks/vendor-detail/use-vendor-detail.js';

/**
 * Constants
 */
import {
  VENDOR_EDIT_EMPTY,
  VENDOR_EDIT_HEADER,
} from '@/features/vendor/constants/index.js';

/**
 * @param {React.PropsWithChildren} props
 */
const VendorEditPageShell = ({ children }) => (
  <React.Fragment>
    <AppHeader
      allowBackward
      title={VENDOR_EDIT_HEADER.title}
      description={VENDOR_EDIT_HEADER.description}
    />
    {children}
  </React.Fragment>
);

export const VendorEdit = () => {
  const { id } = useParams();
  const { data, isLoading, isFetching, error, refetch } = useVendorDetail(id);

  if (isLoading) return <VendorEditSkeleton />;

  if (error) {
    return (
      <VendorEditPageShell>
        <VendorEditEmptyState
          title={VENDOR_EDIT_EMPTY.loadError.title}
          description={
            error?.message ?? VENDOR_EDIT_EMPTY.loadError.description
          }
          onReload={() => refetch()}
          isReloading={isFetching}
        />
      </VendorEditPageShell>
    );
  }

  if (!data?.vendor) {
    return (
      <VendorEditPageShell>
        <VendorEditEmptyState
          title={VENDOR_EDIT_EMPTY.notFound.title}
          description={VENDOR_EDIT_EMPTY.notFound.description}
          onReload={() => refetch()}
          isReloading={isFetching}
        />
      </VendorEditPageShell>
    );
  }

  return (
    <VendorEditForm
      id={Number(id)}
      data={data}
    />
  );
};

/**
 * @param {{ id: number, data: import('@/features/vendor/types/index.js').VendorDetailResponse }} props
 */
const VendorEditForm = ({ id, data }) => {
  const form = useVendorEditForm(id, data);

  return (
    <VendorEditPageShell>
      <main className='flex flex-col gap-12'>
        <VendorBaseEditForm
          form={form}
          vendor={data.vendor}
        />
        <VendorProductEditForm form={form} />
      </main>
      <section className='mt-6 mb-20'>
        <VendorEditAction form={form} />
      </section>
    </VendorEditPageShell>
  );
};
