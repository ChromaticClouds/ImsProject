// @ts-check

/**
 * Hooks
 */
import { ERROR } from '@/services/error.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * @template TInput
 * @template TOutput
 * @param {(input: TInput) => Promise<TOutput>} mutationFn
 * @param {import('@tanstack/react-query').UseMutationOptions<TOutput, Error, TInput>} options
 */
export const useAuthMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  return useMutation({
    mutationFn,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me', 'users'] });
      options.onSuccess(...args);
      navigate('/dashboard');
    },
    onError: async (e) => {
      if (e instanceof HTTPError) {
        return e.response.json().then(e => toast.error(e.message));
      }

      toast.error(ERROR.SERVER_ERROR);
    },
  });
};
