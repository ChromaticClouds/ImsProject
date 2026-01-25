// @ts-check

/**
 * Hooks
 */
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
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      options.onSuccess(...args);
      navigate('/');
    },
    onError: (e) => {
      if (e instanceof HTTPError) {
        e.response.json().then(e => toast.success(e.message));
      }
    },
  });
};
