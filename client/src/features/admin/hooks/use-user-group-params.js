// @ts-check
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useUserGroupParams = () => {
  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page') ?? 1) || 1;
  const search = params.get('search') ?? '';

  const query = useMemo(
    () => ({ page, search }),
    [page, search],
  );

  return { params, setParams, query };
};
