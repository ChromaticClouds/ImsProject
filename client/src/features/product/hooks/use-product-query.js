// @ts-check

import { useSearchParams } from 'react-router-dom';
import { useProductView } from './use-product-view.js';
import { useMemo } from 'react';

export const useProductQuery = () => {
  const [params] = useSearchParams();

  const page = Number(params.get('page') ?? 1);
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
    [page, search, type, brand],
  );

  const { data, isFetching } = useProductView(query);

  const pageData = data?.data;

  return {
    content: pageData?.content ?? [],
    pageResponse: pageData
      ? {
          page: pageData.page,
          totalElements: pageData.totalElements,
          totalPages: pageData.totalPages,
          isFirst: pageData.isFirst,
          isLast: pageData.isLast,
        }
      : null,
    isFetching
  };
};
