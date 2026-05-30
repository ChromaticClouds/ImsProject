// @ts-check
import { createContext, useContext, useMemo, useState } from 'react';
import { OutboundOverviewScreen } from '../components/outbound-overview-screen.jsx';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';

const Ctx = createContext(null);

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

function getMyUserIdFromToken(token) {
  const p = decodeJwtPayload(token);
  if (!p) return null;
  if (p.id != null && !Number.isNaN(Number(p.id))) return Number(p.id);
  if (p.userId != null && !Number.isNaN(Number(p.userId))) return Number(p.userId);
  if (p.sub != null && !Number.isNaN(Number(p.sub))) return Number(p.sub);
  return null;
}

export function OutboundOverviewProvider() {
  const t = todayYMD();

  const toDate = new Date();
  toDate.setFullYear(toDate.getFullYear() + 1);
  const toYMD = todayYMDFrom(toDate);

  const [search, setSearch] = useState(() => ({ from: t, to: toYMD }));
  const [error, setError] = useState('');

  const accessToken = useAuthStore((s) => s.accessToken);
  const myId = useMemo(() => getMyUserIdFromToken(accessToken), [accessToken]);

  const value = useMemo(
    () => ({
      search,
      setSearch,
      myId,
      error,
      setError,
    }),
    [search, myId, error]
  );

  return (
    <Ctx.Provider value={value}>
      <OutboundOverviewScreen />
    </Ctx.Provider>
  );
}

function todayYMDFrom(/** @type {Date} */ d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
