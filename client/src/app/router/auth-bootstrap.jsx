// @ts-check

/**
 * Components
 */
import { RouteAccessGuard } from '@/app/router/route-access-guard.jsx';
import { AppLoading } from '@/components/common/app-loading.jsx';
import { Suspense } from 'react';
import { Await } from 'react-router-dom';

/**
 * Hooks
 */
import { useLoaderData } from 'react-router-dom';

/**
 * 토큰 소유 여부 판단하기 위한 부트스트랩 컴포넌트
 */
export const AuthBootstrap = () => {
  /**
   * @type {ReturnType<typeof useLoaderData<{ 
   *   auth: { authenticated: boolean, role: User['userRole'] } 
   * }>>}
   */
  const { auth } = useLoaderData();

  return (
    <Suspense fallback={<AppLoading />}>
      <Await resolve={auth}>
        {(result) => (
          <RouteAccessGuard 
            authenticated={result.authenticated}
            role={result.role}
          />
        )}
      </Await>
    </Suspense>
  );
};
