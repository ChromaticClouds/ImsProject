import { createContext } from 'react';
import { usePoPostForm } from '../hooks/use-po-post-form.js';
import { useContext } from 'react';

/**
 * @type {React.Context<ReturnType<typeof usePoPostForm> | null>}
 */
const PoPostFormContext = createContext(null);

export const usePoFormContext = () => {
  const ctx = useContext(PoPostFormContext);
  if (!ctx) throw new Error('PoPostFormContext is not provided');
  return ctx;
}

/**
 * @param {React.PropsWithChildren} props
 */
export const PoPostFormProvider = ({ children }) => {
  const form = usePoPostForm();

  return (
    <PoPostFormContext.Provider value={form}>
      {children}
    </PoPostFormContext.Provider>
  );
};
