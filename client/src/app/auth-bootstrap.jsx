// @ts-check

/**
 * Components
 */
import { AppLoading } from '@/components/common/app-loading.jsx';
import { Suspense } from 'react';
import { Await, Navigate, Outlet, useLoaderData } from 'react-router-dom';

/**
 * 토큰 소유 여부 판단하기 위한 부트스트랩 컴포넌트
 */
export const AuthBootstrap = () => {
  /**
   * @type {ReturnType<typeof useLoaderData<{ 
   *   auth: { authenticated: boolean } 
   * }>>}
   */
  const { auth } = useLoaderData();

  return (
    <Suspense fallback={<AppLoading />}>
      <Await resolve={auth}>
        {(result) => {
          if (!result.authenticated) {
            return <Navigate to="/login" replace />;
          }

          return <Outlet />;
        }}
      </Await>
    </Suspense>
  );
};
