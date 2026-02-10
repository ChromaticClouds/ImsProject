import { useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 10;

export const usePurchaseOrderPagination = (list) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  }, [list, currentPage]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedList,
  };
};