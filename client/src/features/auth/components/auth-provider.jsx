/**
 * Contexts
 */
import { createContext } from "react";

/**
 * Hooks
 */
import { useAuthForm } from "@/features/auth/hooks/use-auth-form.js";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

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

/**
 * @typedef {object} AuthContextValue
 * @property {AuthMode} mode
 * @property {ReturnType<typeof useAuthForm>['login' | 'register']} form
 */

/** @type {React.Context<AuthContextValue | null>} */
const AuthContext = createContext(null);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('Auth context is not provided');
  return ctx;
}

/**
 * @param {{ children: React.ReactNode}} props 
 */
export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const authForm = useAuthForm();

  const isLogin = location.pathname.includes('login');

  const { isError } = useQuery({
    enabled: !isLogin
  });

  /** @type {AuthContextValue} */
  const value = isLogin
    ? { mode: 'login', form: authForm.login }
    : { mode: 'register', form: authForm.register };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
