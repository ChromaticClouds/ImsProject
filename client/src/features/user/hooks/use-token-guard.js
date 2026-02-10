/**
 * Hooks
 */
import { useSearchParams } from 'react-router-dom';

/**
 * Api
 */
import { verifyPasswordResetToken } from '../api/index.js';
import { useQuery } from '@tanstack/react-query';

export const useTokenGuard = () => {
  const [params] = useSearchParams();

  const token = params.get('token');

  const { isLoading, isError, data } = useQuery({
    queryKey: ['password-reset-token', token],
    queryFn: () => verifyPasswordResetToken(token),
    enabled: !!token,
    retry: false
  });

  return {
    token,
    isLoading,
    isValid: !!data?.success,
    isError,
  };
};
