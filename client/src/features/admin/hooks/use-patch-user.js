import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUser } from '../api/index.js';
import { toast } from 'sonner';
import { HTTPError } from 'ky';
import { ERROR } from '@/services/error.js';

/**
 * @typedef {object} StatusRequest
 * @property {string} [rank]
 * @property {string} [role]
 * @property {string} [status]
 * @property {string} [name]
 */

/**
 * @typedef {object} UserRequest
 * @property {number} id
 * @property {StatusRequest} body
 */

export const usePatchUser = () => {
  const qc = useQueryClient();

  return useMutation({
    /** @param {UserRequest} props */
    mutationFn: ({ id, body }) => patchUser(id, body),

    onSuccess: () => toast.success('요청이 성공적으로 처리되었습니다.'),

    /** @param {UserRequest} props */
    onMutate: async ({ id, body }) => {
      await qc.cancelQueries({ queryKey: ['users'] });

      const prev = qc.getQueryData(['users']);

      qc.setQueryData(['users'], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            content: old.data.content.map((u) =>
              u.id === id ? { ...u, ...body } : u,
            ),
          },
        };
      });

      return { prev };
    },

    onError: async (e, _v, ctx) => {
      qc.setQueryData(['users'], ctx.prev);

      if (e instanceof HTTPError) {
        const response = await e.response.json();
        toast.error(response.message);
      }

      toast.error(ERROR.SERVER_ERROR);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
