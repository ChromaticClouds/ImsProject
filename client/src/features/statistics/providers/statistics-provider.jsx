import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const Ctx = createContext(null);

export function useStatisticsCtx() {
  const v = useContext(Ctx);
  if (!v) throw new Error('StatisticsProvider is missing');
  return v;
}