// @ts-check

/**
 * Node modules
 */
import { toast } from 'sonner';
import { HTTPError } from 'ky';

/**
 * Stores
 */
import { useEmailStore } from '@/features/admin/stores/use-email-store.js';

/**
 * Api
 */
import { api } from '@/services/api.js';
import { ERROR } from '@/services/error.js';
import { useQueryClient } from '@tanstack/react-query';

export const useEmailSubmit = () => {
  const queryClient = useQueryClient();

  const emails = useEmailStore((s) => s.emails);
  const deleteAllEmails = useEmailStore((s) => s.deleteAllEmails);

  return {
    emails,

    handleEmailSubmit: async () => {
      if (emails.length === 0)
        return toast.error('초대할 이메일을 입력해주세요.');

      if (emails.length >= 10)
        return toast.error(
          '초대 메일 입력은 한 번에 10개를 초과할 수 없습니다.',
        );

      try {
        const response = /** @type {ApiResponse} */ (
          await api.post('invitation', { json: { emails } }).json()
        );

        if (response.success)
          toast.success(response.message ?? '초대 메일을 발송했습니다.');
        
        queryClient.invalidateQueries({
          queryKey: ['users']
        });
        
        deleteAllEmails();
      } catch (err) {
        if (err instanceof HTTPError) {
          const errResponse = /** @type {ApiResponse} */ (
            await err.response.json()
          );

          return toast.error(errResponse.message);
        }

        toast.error(ERROR.SERVER_ERROR);
      }
    },
  };
};
