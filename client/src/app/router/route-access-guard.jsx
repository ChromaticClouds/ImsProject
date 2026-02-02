// @ts-check

/**
 * Utils
 */
import { toast } from 'sonner';

/**
 * Hooks
 */
import { useEffect } from 'react';
import { useMatches } from 'react-router-dom';

/**
 * Components
 */
import { Navigate, Outlet } from 'react-router-dom';
import { ERROR } from '@/services/error.js';

/**
 * 현재 매칭된 라우트들에 대해 사용자의 접근 권한을 검사한다.
 *
 * @param {import('react-router-dom').UIMatch[]} matches
 * @param {User['role']} role
 * @returns {boolean}
 */
const hasRouteAccess = (matches, role) => {
  return matches.every((match) => {
    const permissions = match.handle?.permissions;
    if (!permissions) return true;
    return permissions.includes(role);
  });
};

/**
 * @param {{ authenticated: boolean, role: User['role'] }} props
 */
export const RouteAccessGuard = ({ authenticated, role }) => {
  /** @type {import('react-router-dom').UIMatch[]} */
  const matches = useMatches();

  const denied = authenticated && !hasRouteAccess(matches, role);

  useEffect(() => {
    if (denied) toast.error(ERROR.INACCESSABLE);
  }, [denied]);

  if (!authenticated) return <Navigate to='/login' replace />;
  
  if (denied) return <Navigate to='/dashboard' replace />;

  return <Outlet />;
};
