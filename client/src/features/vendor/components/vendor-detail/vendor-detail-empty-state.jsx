/**
 * Components
 */
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty.js';
import { Button } from '@/components/ui/button.js';

/**
 * Assets
 */
import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';

/**
 * @param {{ title: string; description: string; onReload: () => void; isReloading?: boolean }} props
 */
export const VendorDetailEmptyState = ({
  title,
  description,
  onReload,
  isReloading = false,
}) => {
  return (
    <Empty className='flex-1 border bg-card'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <AlertCircleIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          type='button'
          variant='outline'
          onClick={onReload}
          disabled={isReloading}
        >
          <RefreshCwIcon
            className={isReloading ? 'animate-spin' : ''}
            aria-hidden='true'
          />
          다시 불러오기
        </Button>
      </EmptyContent>
    </Empty>
  );
};
