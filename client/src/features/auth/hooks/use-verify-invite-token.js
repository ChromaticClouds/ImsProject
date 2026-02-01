import { verifyToken } from '@/features/auth/api/index.js';
import { useQuery } from '@tanstack/react-query';

/**
 * 예시: `( /?token=... )`
 * URL에 첨부된 token이 있을 경우, token 검증을 시행, 없을 경우 에러 폴백
 * @param {string} token
 */
export const useVerifyInviteToken = (token) => {
  return useQuery({
    queryKey: ['verify-invite-token', token],
    queryFn: () => verifyToken(token),
    enabled: !!token,
    retry: 1,
  });
};
