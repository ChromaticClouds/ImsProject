// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { updateNotice } from '../api';
import { toast } from 'sonner';

/**
 * @typedef {object} NoticeUpdateVariables
 * @property {number} id
 * @property {FormData} formData
 */

export const useNoticeUpdateMutation = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    /** @param {NoticeUpdateVariables} variables */
    mutationFn: async (variables) => {
      console.log('[update] mutationFn start', variables.id);
      const res = await updateNotice(variables.id, variables.formData);
      console.log('[update] mutationFn res', res);

      // 서버가 { ok:false }를 주는 케이스도 실패로 취급해서 onError로 넘기기
      if (res && res.success === false) {
        const msg = res.message ?? '수정 실패(ok=false)';
        throw new Error(msg);
      }
      return res;
    },

    onSuccess: async (res, variables) => {
      const { id } = variables;

      toast.success(res?.message ?? '수정되었습니다', {
        id: 'notice-update-success',
      });

      await qc.invalidateQueries({ queryKey: ['notices'] });
      await qc.invalidateQueries({ queryKey: ['notice', id] });

      console.log('[update] navigate to detail', id);
      if (res?.success != false) {
        navigate(`/dashboard/notice/${id}`);
      }
    },

    onError: (err) => {
      console.error('[update] onError', err);
      toast.error(`수정 실패: ${err?.message ?? err}`, {
        id: 'notice-update-error',
      });
    },
  });
};
