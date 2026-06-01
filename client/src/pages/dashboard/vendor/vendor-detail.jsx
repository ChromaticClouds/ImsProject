// @ts-check

import React from 'react';

/**
 * Components
 */
import { AppHeader } from '@/components/common/app-header.jsx';
import { VendorBaseInfo } from '@/features/vendor/components/vendor-detail/vendor-base-info.jsx';
import { VendorDetailEmptyState } from '@/features/vendor/components/vendor-detail/vendor-detail-empty-state.jsx';
import { VendorDetailHeader } from '@/features/vendor/components/vendor-detail/vendor-detail-header.jsx';
import { VendorDetailSkeleton } from '@/features/vendor/components/vendor-detail/vendor-detail-skeleton.jsx';
import { VendorKpiRow } from '@/features/vendor/components/vendor-detail/vendor-kpi-row.jsx';
import { VendorProducts } from '@/features/vendor/components/vendor-detail/vendor-products.jsx';
import { useDeleteVendor } from '@/features/vendor/hooks/vendor-detail/use-delete-vendor.js';

/**
 * Hooks
 */
import { useVendorDetail } from '@/features/vendor/hooks/vendor-detail/use-vendor-detail.js';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Constants
 */
import {
  VENDOR_DETAIL_EMPTY,
  VENDOR_DETAIL_HEADER,
} from '@/features/vendor/constants/index.js';

/**
 * @import { VendorProductType } from '@/features/vendor/types/index.js';
 */

/**
 * @typedef {object} VendorDetailProps
 * @property {Vendor} vendor
 * @property {VendorProductType} items
 */

/**
 * @param {React.PropsWithChildren} props
 */
const VendorDetailPageShell = ({ children }) => (
  <div className='h-full flex flex-col'>
    <AppHeader
      allowBackward
      title={VENDOR_DETAIL_HEADER.title}
      description={VENDOR_DETAIL_HEADER.description}
    />
    {children}
  </div>
);

export const VendorDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isFetching, error, refetch } = useVendorDetail(id);
  const { mutateAsync: deleteVendor, isPending } = useDeleteVendor();
  const navigate = useNavigate();

  if (isLoading) return <VendorDetailSkeleton />;

  if (error) {
    return (
      <VendorDetailPageShell>
        <VendorDetailEmptyState
          title={VENDOR_DETAIL_EMPTY.loadError.title}
          description={
            error?.message ?? VENDOR_DETAIL_EMPTY.loadError.description
          }
          onReload={() => refetch()}
          isReloading={isFetching}
        />
      </VendorDetailPageShell>
    );
  }

  if (!data?.vendor) {
    return (
      <VendorDetailPageShell>
        <VendorDetailEmptyState
          title={VENDOR_DETAIL_EMPTY.notFound.title}
          description={VENDOR_DETAIL_EMPTY.notFound.description}
          onReload={() => refetch()}
          isReloading={isFetching}
        />
      </VendorDetailPageShell>
    );
  }

  const { vendor, items } = data;
  const isSupplier = vendor.type === 'Supplier';

  return (
    <>
      <VendorDetailHeader
        vendor={vendor}
        onEdit={() => navigate(`/dashboard/vendor/modify/${id}`)}
        onDelete={() => deleteVendor(Number(id))}
        isSubmitting={isPending}
      />
      {isSupplier && <VendorKpiRow items={items} />}
      <div className='mt-4 flex flex-col gap-4'>
        <VendorBaseInfo vendor={vendor} />
        {isSupplier && <VendorProducts items={items} />}

        {/* 메모 */}
        <div className='rounded-lg border bg-card'>
          <div className='border-b px-5 py-4'>
            <h2 className='text-sm font-medium'>메모</h2>
          </div>
          <div className='min-h-20 whitespace-pre-wrap px-5 py-4 text-sm leading-6 text-muted-foreground'>
            {vendor.memo || '등록된 메모가 없습니다.'}
          </div>
        </div>
      </div>
    </>
  );
};
