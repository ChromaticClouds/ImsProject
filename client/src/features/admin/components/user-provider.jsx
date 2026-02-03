// @ts-check

/**
 * Contexts
 */
import { createContext } from 'react';

/**
 * Hooks
 */
import { useUsers } from '../hooks/use-users.js';
import { useContext } from 'react';
import { useMemo } from 'react';
import { toUserRowModel } from '../schemas/user-model.js';

/**
 * @typedef {object} UserListContextValue
 * @property {ReturnType<typeof toUserRowModel>[]} users
 * @property {number} page
 * @property {number} totalPages
 * @property {number} totalElements
 * @property {boolean} isFirst
 * @property {boolean} isLast
 */

/**
 * @type {React.Context<UserListContextValue | null>}
 */
const UserListContext = createContext(null);

export const useUserList = () => {
  const ctx = useContext(UserListContext);
  if (!ctx) throw new Error('UserList.Row must be used insdie UserList');
  return ctx;
};

/**
 * @param {React.PropsWithChildren} props
 */
export const UserProvider = ({ children }) => {
  const { data } = useUsers();

  const {
    content = [],
    page = 0,
    totalPages = 0,
    totalElements = 0,
    isFirst = true,
    isLast = true,
  } = data?.data ?? {};

  const users = useMemo(() => {
    return content.map(toUserRowModel);
  }, [content]);

  return (
    <UserListContext.Provider
      value={{
        users,
        page,
        totalPages,
        totalElements,
        isFirst,
        isLast,
      }}
    >
      {children}
    </UserListContext.Provider>
  );
};
