import { AppErrorBoundary } from '@/components/common/app-error-boundary.jsx';
import { AppLoading } from '@/components/common/app-loading.jsx';
import { useInviteGuard } from '@/features/auth/hooks/use-invite-guard.js';

/**
 * @typedef {'login' | 'register'} AuthMode
 */

/**
 * @param {{
 *  children: (props: { mode: AuthMode }) => React.ReactNode
 * }} props
 */
export const AuthGuardResolver = ({ children }) => {
  const access = useInviteGuard();

  if (access.status === 'checking') {
    return <AppLoading />;
  }

  if (access.status === 'invalid-access') {
    return (
      <AppErrorBoundary
        statusCode={400}
        message='만료된 초대장이거나 유효하지 않은 페이지입니다.'
        buttonText='로그인 페이지로 가기'
        to={'/login'}
      />
    );
  }

  // 여기 도달하면 status는 login | register 만 가능
  return children({ mode: access.status });
};
