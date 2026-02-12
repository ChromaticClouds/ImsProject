import { resendEmail } from '@/features/admin/api/index.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useResendEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /** @param {string} email */
    mutationFn: (email) => resendEmail(email),

    onSuccess: () => {
      toast.success('이메일이 재발송 되었습니다.');
    },
  });
};
