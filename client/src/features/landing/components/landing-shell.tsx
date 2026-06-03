import type { ReactNode } from 'react';

type LandingShellProps = {
  children: ReactNode;
  className?: string;
};

export const LandingShell = ({ children, className = '' }: LandingShellProps) => {
  return (
    <div className={`mx-auto w-[min(1180px,calc(100%_-_2rem))] ${className}`}>
      {children}
    </div>
  );
};
