// @ts-check
import { createContext, useContext, useMemo, useState } from 'react';
import { OutboundOverviewScreen } from '../components/outbound-overview-screen.jsx';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';

/** @typedef {{ from: string, to: string, userId?: number }} OutboundSearch */
/**
 * @typedef {object} OutboundOverviewContext
 * @property {OutboundSearch} search
 * @property {React.Dispatch<React.SetStateAction<OutboundSearch>>} setSearch
 * @property {number | null} myId
 * @property {string} error
 * @property {React.Dispatch<React.SetStateAction<string>>} setError
 */

const Ctx = createContext(/** @type {OutboundOverviewContext | null} */ (null));

export function useOutboundOverviewCtx() {
  const v = useContext(Ctx);
  if (!v) throw new Error('OutboundOverviewProvider is missing');
  return v;
}

function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * @param {string | null | undefined} token
 * @returns {Record<string, unknown> | null}
 */
function decodeJwtPayload(token) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length < 2) return null;
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** @param {string | null | undefined} token */
function getMyUserIdFromToken(token) {
  const p = decodeJwtPayload(token);
  if (!p) return null;
  if (p.id != null && !Number.isNaN(Number(p.id))) return Number(p.id);
  if (p.userId != null && !Number.isNaN(Number(p.userId)))
    return Number(p.userId);
  if (p.sub != null && !Number.isNaN(Number(p.sub))) return Number(p.sub);
  return null;
}

export function OutboundOverviewProvider() {
  const t = todayYMD();
  const accessToken = useAuthStore((s) => s.accessToken);
  const myId = useMemo(() => getMyUserIdFromToken(accessToken), [accessToken]);
  const [search, setSearch] = useState(
    /** @returns {OutboundSearch} */ () => ({
      from: t,
      to: t,
      ...(myId == null ? {} : { userId: myId }),
    }),
  );
  const [error, setError] = useState('');

  const value = useMemo(
    () => ({
      search,
      setSearch,
      myId,
      error,
      setError,
    }),
    [search, myId, error],
  );

  return (
    <Ctx.Provider value={value}>
      <OutboundOverviewScreen />
    </Ctx.Provider>
  );
}
