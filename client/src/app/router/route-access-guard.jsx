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
 * @type {Record<User['userRank'], number>}
 */
const RANK_MAP = {
  EMPLOYEE: 1,
  SECOND_ADMIN: 2,
  FIRST_ADMIN: 3,
}

/**
 * 현재 매칭된 라우트들에 대해 사용자의 접근 권한을 검사한다.
 *
 * @param {import('react-router-dom').UIMatch[]} matches
 * @param {User['userRole']} role
 * @param {User['userRank']} rank
 * @returns {boolean}
 */
const hasRouteAccess = (matches, role, rank) => {
  return matches.every((match) => {
    const permissions = match.handle?.permissions; // role 기반
    const minRank = match.handle?.minRank ?? 1;  // 최소 rank
    const maxRank = match.handle?.maxRank ?? 3;

    // role 검사
    if (permissions && !permissions.includes(role)) return false;

    const numberRank = RANK_MAP[rank];

    // RANK (EMPLOYEE: 1, SECOND_ADMIN: 2, FIRST_ADMIN: 3)
    // router handle 프로퍼티로 minRank, maxRank 필드를 달아둘 것

    /**
     * @example
     * {
     *   path: 'auth',
     *   element: <Auth />
     *   handle: {
     *     minRank: 1,
     *     maxRank: 2
     *   }
     * }
     */
    if (minRank !== undefined && numberRank < minRank) return false;
    if (maxRank !== undefined && numberRank > maxRank) return false;

    return true;
  });
};

/**
 * @param {{ authenticated: boolean, role: User['userRole'], rank: User['userRank'] }} props
 */
export const RouteAccessGuard = ({ authenticated, role, rank }) => {
  /** @type {import('react-router-dom').UIMatch[]} */
  const matches = useMatches();

  const denied = authenticated && !hasRouteAccess(matches, role, rank);

  useEffect(() => {
    if (denied) toast.error(ERROR.INACCESSABLE);
  }, [denied]);

  if (!authenticated) return <Navigate to='/login' replace />

  if (denied) return <Navigate to='/dashboard' replace />

  return <Outlet />;
};
