// @ts-check

/**
 * Contexts
 */
import { createContext } from "react";

/**
 * Hooks
 */
import { useAuthForm } from "@/features/auth/hooks/use-auth-form.js";
import { useContext } from "react";

/**
 * @typedef {'login' | 'register'} AuthMode
 */

/**
 * @typedef {object} LoginContext
 * @property {'login'} mode
 * @property {ReturnType<typeof useAuthForm>['login']} form
 */

/**
 * @typedef {object} RegisterContext
 * @property {'register'} mode
 * @property {ReturnType<typeof useAuthForm>['register']} form
 */

/**
 * @typedef {LoginContext | RegisterContext} AuthContextValue;
 */


/** @type {React.Context<AuthContextValue | null>} */
const AuthContext = createContext(null);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('Auth context is not provided');
  return ctx;
}

/**
 * @param {{ mode: 'register' | 'login', children: React.ReactNode }} props 
 */
export const AuthProvider = ({ mode, children }) => {
  const authForm = useAuthForm();

  /** @type {AuthContextValue} */
  const value = mode === 'login'
    ? { mode: 'login', form: authForm.login }
    : { mode: 'register', form: authForm.register };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
