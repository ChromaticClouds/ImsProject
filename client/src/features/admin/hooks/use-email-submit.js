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

export const useEmailSubmit = () => {
  const emails = useEmailStore((s) => s.emails);

  return {
    emails,

    /**
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    handleEmailSubmit: async () => {
      if (emails.length === 0)
        return toast.error('초대할 이메일을 입력해주세요.');

      try {
        const response = /** @type {ApiResponse} */ (
          await api.post('invitation', { json: { emails } }).json()
        );

        if (response.success)
          toast.success(response.message ?? '초대 메일을 발송했습니다.');
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
