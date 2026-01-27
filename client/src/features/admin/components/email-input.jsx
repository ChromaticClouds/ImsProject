// @ts-check

/**
 * Components
 */
import { InputGroupInput } from '@/components/ui/input-group';
import { EmailBadgeList } from '@/features/admin/components/email-badge-list.jsx';

/**
 * Hooks
 */
import { useEmailInput } from '@/features/admin/hooks/use-email-input.js';
import { useEmailStore } from '@/features/admin/stores/use-email-store.js';

export const EmailInput = () => {
  const { value, setValue } = useEmailStore();
  const { onKeyDown, onPaste } = useEmailInput();

  return (
    <div className='w-full flex flex-col gap-2 py-2'>
      <EmailBadgeList />

      <InputGroupInput
        className='flex-1 border-none shadow-none focus-visible:ring-0'
        placeholder='이메일 입력 후 콤마( , ) 혹은 Enter'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        autoComplete='off'
      />
    </div>
  );
};
