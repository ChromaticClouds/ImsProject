import React from 'react';

/**
 * Components
 */
import { AppHeader } from '@/components/common/app-header.jsx';
import { Skeleton } from '@/components/ui/skeleton.js';

const VendorDetailKpiSkeleton = () => {
  return (
    <div className='grid grid-cols-3 gap-2.5 sm:gap-3'>
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className='rounded-md bg-muted/60 px-3 py-3'
        >
          <Skeleton className='h-3 w-16' />
          <Skeleton className='mt-2 h-5 w-20' />
          {index > 0 && <Skeleton className='mt-2 h-3 w-24' />}
        </div>
      ))}
    </div>
  );
};

const VendorDetailInfoRowSkeleton = () => {
  return (
    <div className='flex items-start gap-3 border-b py-2.5 last:border-b-0'>
      <Skeleton className='mt-0.5 size-7 shrink-0 rounded-md' />
      <div className='min-w-0 flex-1'>
        <Skeleton className='h-3 w-16' />
        <Skeleton className='mt-2 h-4 w-2/3' />
      </div>
    </div>
  );
};

const VendorDetailCardSkeleton = () => {
  return (
    <div className='rounded-lg border bg-card'>
      <div className='flex items-center justify-between border-b px-5 py-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-3 w-32' />
        </div>
        <Skeleton className='size-4 rounded-sm' />
      </div>
      <div className='px-5 py-3'>
        {Array.from({ length: 5 }, (_, index) => (
          <VendorDetailInfoRowSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const VendorDetailProductRowSkeleton = () => {
  return (
    <div className='flex items-center gap-3 border-b py-2.5 last:border-b-0'>
      <Skeleton className='size-8 shrink-0 rounded-md' />
      <div className='min-w-0 flex-1'>
        <Skeleton className='h-4 w-48 max-w-full' />
        <Skeleton className='mt-2 h-3 w-32 max-w-full' />
      </div>
      <Skeleton className='h-4 w-20 shrink-0' />
    </div>
  );
};

const VendorDetailProductsSkeleton = () => {
  return (
    <div className='rounded-lg border bg-card'>
      <div className='flex items-center justify-between border-b px-5 py-4'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-3 w-24' />
        </div>
        <Skeleton className='size-4 rounded-sm' />
      </div>
      <div className='px-5 py-3'>
        {Array.from({ length: 4 }, (_, index) => (
          <VendorDetailProductRowSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

const VendorDetailMemoSkeleton = () => {
  return (
    <div className='rounded-lg border bg-card'>
      <div className='border-b px-5 py-4'>
        <Skeleton className='h-4 w-12' />
      </div>
      <div className='min-h-20 space-y-2 px-5 py-4'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
      </div>
    </div>
  );
};

export const VendorDetailSkeleton = () => {
  return (
    <React.Fragment>
      <AppHeader
        allowBackward
        title={
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-8 w-48 max-w-full' />
          </div>
        }
        description={<Skeleton className='h-4 w-72 max-w-full' />}
        asideDecoration={
          <div className='flex shrink-0 items-end gap-2'>
            <Skeleton className='h-10 w-20' />
            <Skeleton className='h-10 w-20' />
          </div>
        }
      />

      <VendorDetailKpiSkeleton />

      <div className='mt-4 flex flex-col gap-4'>
        <VendorDetailCardSkeleton />
        <VendorDetailProductsSkeleton />
        <VendorDetailMemoSkeleton />
      </div>
    </React.Fragment>
  );
};
