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
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

/**
 * @typedef {object} UserListContextValue
 * @property {number} count
 * @property {ReturnType<typeof toUserRowModel>[]} users
 * @property {number} page
 * @property {number} totalPages
 * @property {number} totalElements
 * @property {boolean} isFirst
 * @property {boolean} isLast
 * @property {boolean} isFetching
 * @property {string} search
 * @property {React.Dispatch<React.SetStateAction<string>>} setSearch
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
  const [search, setSearch] = useState('');
  const [params] = useSearchParams();
  const pageNumber = Number(params.get('page') ?? 1);

  const { data, isFetching } = useUsers(pageNumber, search);

  const {
    content = [],
    page = 1,
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
        count: totalElements,
        users,
        page,
        totalPages,
        totalElements,
        isFirst,
        isLast,
        isFetching,
        search,
        setSearch,
      }}
    >
      {children}
    </UserListContext.Provider>
  );
};
