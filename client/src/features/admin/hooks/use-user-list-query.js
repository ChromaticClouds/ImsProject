import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUsers } from './use-users.js';
import { toUserRowModel } from '../schemas/user-model.js';

export const useUserListQuery = () => {
  const [params] = useSearchParams();
  const pageNumber = Number(params.get('page') ?? 1) || 1;
  const search = params.get('search') ?? '';

  const query = useUsers(pageNumber, search);

  const {
    content = [],
    page = 1,
    totalPages = 0,
    totalElements = 0,
    isFirst = true,
    isLast = true,
  } = query.data?.data ?? {};

  const users = useMemo(() => content.map(toUserRowModel), [content]);

  return {
    ...query,
    count: totalElements,
    users,
    page,
    totalPages,
    totalElements,
    isFirst,
    isLast,
    search,
  };
};
