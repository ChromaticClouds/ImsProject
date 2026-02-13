// @ts-check
import { memo } from 'react';

/**
 * Components
 */
import { Badge } from '@/components/ui/badge';
import { XIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useEmailStore } from '@/features/admin/stores/use-email-store';

export const EmailBadgeList = memo(() => {
  const emails = useEmailStore((s) => s.emails);
  const deleteEmail = useEmailStore((s) => s.deleteEmail);

  if (emails.length === 0) return null;

  return (
    <div className='w-full flex gap-2 px-2 py-1 flex-wrap'>
      {emails.map((email, idx) => (
        <Badge
          key={email}
          variant='secondary'
          className='flex items-center gap-1'
        >
          {email}
          <button
            type='button'
            onClick={() => deleteEmail(idx)}
            aria-label={`${email} 삭제`}
          >
            <XIcon className='h-3 w-3' />
          </button>
        </Badge>
      ))}
    </div>
  );
});

EmailBadgeList.displayName = 'EmailBadgeList';
