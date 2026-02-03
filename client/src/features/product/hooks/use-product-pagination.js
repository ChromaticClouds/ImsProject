// @ts-check
import { useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 5;

export const useProductPagination = (list) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  }, [list, currentPage]);

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);

  return {
    currentPage,
    setCurrentPage,
    paginatedList,
    totalPages,
  };
};
