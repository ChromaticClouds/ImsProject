// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { createNotice, updatePinned } from '@/features/notice/api/index.js';

type NoticeCreateMutationVariables = {
  formData: FormData;
  unpinNoticeIds?: number[];
};

const assertSuccess = (response: ApiResponse | unknown) => {
  if (
    response &&
    typeof response === 'object' &&
    'success' in response &&
    response.success === false
  ) {
    throw new Error(
      'message' in response && typeof response.message === 'string'
        ? response.message
        : '요청 실패',
    );
  }
};

export const useNoticeCreateMutation = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      formData,
      unpinNoticeIds = [],
    }: NoticeCreateMutationVariables) => {
      await Promise.all(
        unpinNoticeIds.map(async (id) => {
          const response = await updatePinned(String(id), false);
          assertSuccess(response);
        }),
      );

      return createNotice(formData);
    },

    onSuccess: async (res) => {
      if (res?.success === false) {
        throw new Error(res.message ?? '등록 실패');
      }

      toast.success(res?.message ?? '등록되었습니다.', {
        id: 'notice-create-success',
      });

      await qc.invalidateQueries({ queryKey: ['notices'] });
      await qc.invalidateQueries({ queryKey: ['pinned', 'notice', 'summary'] });
      navigate('/dashboard/notice');
    },

    onError: (err) => {
      toast.error(`등록 실패: ${err?.message ?? err}`, {
        id: 'notice-create-error',
      });
    },
  });
};
