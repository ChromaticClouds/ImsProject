// @ts-check

import { useNavigate } from 'react-router-dom';

/**
 * v0 by Vercel.
 * @see https://v0.app/t/yI5mVhYRWnA
 * Documentation: https://v0.app/docs#integrating-generated-code-into-your-nextjs-app
 */

/**
 * @param {{ statusCode?: number, message?: string, buttonText?: string, to?: any }} props
 */
export const AppErrorBoundary = ({ statusCode, message, buttonText, to }) => {
  const navigate = useNavigate();

  return (
    <div className='w-screen flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-md text-center'>
        <div className='mx-auto h-12 w-12 text-primary' />
        <h1 className='mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl'>
          {statusCode ?? '404'}
        </h1>
        <p className='mt-4 text-lg text-muted-foreground'>
          {message ??
            "Oops, it looks like the page you're looking for doesn't exist."}
        </p>
        <div className='mt-6'>
          <button
            onClick={() => navigate(to ?? -1)}
            className='inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
          >
            {buttonText ?? 'Go to Homepage'}
          </button>
        </div>
      </div>
    </div>
  );
};
