// @ts-check

import { Separator } from '@/components/ui/separator.js';

/**
 * @param {{ title: React.ReactNode, description?: React.ReactNode }} props
 */
export const AppHeader = ({ title, description }) => {
  return (
    <div className='w-full mt-18 mb-6'>
      <div className='flex flex-col gap-1'>
        <div className='text-2xl font-semibold tracking-tight'>{title}</div>

        {description && (
          <p className='text-sm text-muted-foreground'>{description}</p>
        )}
      </div>

      <Separator className='mt-4' />
    </div>
  );
};
