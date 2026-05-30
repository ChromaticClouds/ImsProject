import React from "react";

/**
 * Components
 */
import { AppHeader } from "@/components/common/app-header.jsx";
import { Skeleton } from "@/components/ui/skeleton.js";
import { VENDOR_EDIT_HEADER } from "@/features/vendor/constants/index.js";

export const VendorEditSkeleton = () => {
  return (
    <React.Fragment>
      <AppHeader {...VENDOR_EDIT_HEADER} />

      <main className='flex flex-col gap-12'>
        <section className='space-y-4'>
          <div className='space-y-2'>
            <Skeleton className='h-7 w-32' />
            <Skeleton className='h-4 w-64' />
          </div>
          <Skeleton className='h-px w-full' />
          <div className='space-y-5'>
            <Skeleton className='h-20 w-full' />
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className='space-y-2'
              >
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-10 w-full' />
              </div>
            ))}
          </div>
        </section>

        <section className='space-y-4'>
          <div className='space-y-2'>
            <Skeleton className='h-7 w-40' />
            <Skeleton className='h-4 w-56' />
          </div>
          <Skeleton className='h-px w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-52 w-full' />
        </section>
      </main>

      <section className='mt-6 mb-20 space-y-3'>
        <Skeleton className='h-px w-full' />
        <div className='flex justify-end gap-3'>
          <Skeleton className='h-10 w-20' />
          <Skeleton className='h-10 w-20' />
        </div>
      </section>
    </React.Fragment>
  );
};
