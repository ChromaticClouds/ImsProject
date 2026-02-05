// @ts-check

import { useAdjustForm } from '@/features/adjust/hooks/use-adjust-form.js';
import { useContext } from 'react';
import { createContext } from 'react';

/**
 * @type {React.Context<ReturnType<typeof useAdjustForm>>}
 */
const AdjustContext = createContext(null);

export const useAdjustContext = () => {
  const ctx = useContext(AdjustContext);
  if (!ctx) throw new Error('AdjustContext is not reached');
  return ctx;
}

/**
 * @param {React.PropsWithChildren} props
 */
export const AdjustFormProvider = ({ children }) => {
  const form = useAdjustForm();

  return (
    <AdjustContext.Provider value={form}>
      {children}
    </AdjustContext.Provider>
  );
};
