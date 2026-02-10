// @ts-check

import { AppLoading } from '@/components/common/app-loading.jsx';
import { useTokenGuard } from '../hooks/use-token-guard.js';
import { AppErrorBoundary } from '@/components/common/app-error-boundary.jsx';
import React from 'react';

/**
 * @param {React.PropsWithChildren} props
 */
export const TokenGuard = ({ children }) => {
  const { isLoading, isValid, isError } = useTokenGuard();

  if (isLoading) return <AppLoading />;

  if (isError || !isValid)
    return (
      <AppErrorBoundary
        statusCode={401}
        message='메일이 만료되었거나 유효하지 않은 접근입니다.'
        buttonText='로그인 페이지로 가기'
        to={'/login'}
      />
    );

  return <React.Fragment>{children}</React.Fragment>;
};
