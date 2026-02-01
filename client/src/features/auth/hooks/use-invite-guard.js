import { useVerifyInviteToken } from '@/features/auth/hooks/use-verify-invite-token.js';
import { useLocation, useSearchParams } from 'react-router-dom';

/**
 * @typedef {{ status: 'checking' } | { status: 'login' } | { status: 'register' } | { status: 'invalid-access' }} InviteStatus
 */

/**
 * /login, /register, /register?token=... 등 패스 접속 분기에 따라서 반환되는 상태를 결정
 * @returns {InviteStatus}
 */
export const useInviteGuard = () => {
  const location = useLocation();
  const [params] = useSearchParams();

  const isLogin = location.pathname.includes('login');
  const token = params.get('token');
  const query = useVerifyInviteToken(token);

  if (query.isFetching) return { status: 'checking' };

  if (isLogin) return { status: 'login' };

  if (!token || query.isError) return { status: 'invalid-access' };

  return { status: 'register' };
};
