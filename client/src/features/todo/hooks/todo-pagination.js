import { useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 5;

export const useTodoPagination = (list = []) => {
  const safeList = Array.isArray(list) ? list : [];
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(safeList.length / ITEMS_PER_PAGE);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return safeList.slice(start, start + ITEMS_PER_PAGE);
  }, [safeList, currentPage]);

  return { currentPage, setCurrentPage, paginatedList, totalPages };
};
