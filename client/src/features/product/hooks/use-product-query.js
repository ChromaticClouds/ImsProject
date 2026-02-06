// @ts-check

import { useSearchParams } from 'react-router-dom';
import { useProductView } from './use-product-view.js';
import { useMemo } from 'react';

export const useProductQuery = () => {
  const [params] = useSearchParams();

  const page = Number(params.get('page') ?? 0);
  const search = params.get('search') ?? '';

  const type = useMemo(
    () => params.get('type')?.split(',').filter(Boolean) ?? [],
    [params],
  );

  const brand = useMemo(
    () => params.get('brand')?.split(',').filter(Boolean) ?? [],
    [params],
  );

  const query = useMemo(
    () => ({ page, search, type, brand }),
    [page, search, type, brand]
  );

  const { data } = useProductView(query);

  const { content = [], ...rest } = data?.data ?? {};

  return { content, pageResponse: rest };
};
