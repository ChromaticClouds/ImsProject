import { Switch } from '@/components/ui/switch.js';
import { BellIcon } from 'lucide-react';

/**
 * @param {{ form: ReturnType<import('@/features/notice/hooks/use-notice-form').useNoticeForm> }} props
 */
export const NoticePinnedSection = ({ form }) => {
  return (
    <form.AppField name='isPinned'>
      {(field) => (
        <div className='flex items-start justify-between gap-4 rounded-md border bg-muted/30 px-4 py-3'>
          <div className='space-y-0.5'>
            <label
              htmlFor={field.name}
              className='flex cursor-pointer items-center gap-2 text-sm font-medium'
            >
              <BellIcon
                className='size-4 text-muted-foreground'
                aria-hidden='true'
              />
              중요 공지
            </label>
            <p className='text-xs text-muted-foreground'>
              활성화하면 목록 상단에 고정되며 강조 표시됩니다.
            </p>
          </div>
          <Switch
            id={field.name}
            checked={field.state.value}
            onCheckedChange={field.handleChange}
            aria-label='중요 공지 고정 여부'
          />
        </div>
      )}
    </form.AppField>
  );
};
