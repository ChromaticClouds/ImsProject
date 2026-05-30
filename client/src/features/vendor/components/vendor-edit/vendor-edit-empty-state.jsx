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
import { RefreshCwIcon, AlertCircleIcon } from 'lucide-react';

/**
 * @param {{ title: string; description: string; onReload: () => void; isReloading?: boolean }} props
 */
export const VendorEditEmptyState = ({
  title,
  description,
  onReload,
  isReloading = false,
}) => {
  return (
    <Empty className='min-h-[calc(100dvh-220px)] border bg-card'>
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
