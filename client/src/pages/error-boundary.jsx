// @ts-check

import { AppErrorBoundary } from '@/components/common/app-error-boundary.jsx';

export const ErrorBoundary = () => {
  return (
    <AppErrorBoundary
      statusCode={404}
      message='잘못된 페이지 요청입니다'
      buttonText='메인 페이지로 가기'
      to={'/dashboard'}
    />
  );
};
