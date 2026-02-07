// @ts-check

import { useContext } from 'react';
import { createContext } from 'react';
import { useAdjustForm } from './use-adjust-form.js';

/**
 * @type {React.Context<ReturnType<typeof useAdjustForm>>}
 */
const AdjustContext = createContext(null);

export const useAdjustContext = () => {
  const ctx = useContext(AdjustContext);
  if (!ctx) throw new Error('AdjustContext is not provided');
  return ctx;
};

/**
 * @param {React.PropsWithChildren} props
 */
export const AdjustProvider = ({ children }) => {
  const form = useAdjustForm();

  return (
    <AdjustContext.Provider value={form}>
      {children}
    </AdjustContext.Provider>
  );
};
