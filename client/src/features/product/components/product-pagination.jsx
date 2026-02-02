// @ts-check

/**
 * @typedef {object} PaginationProps
 * @property {number} currentPage
 * @property {number} totalPages
 * @property {React.Dispatch<React.SetStateAction<number>>} setCurrentPage
 */

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useEffect } from "react";

/**
 * @param {PaginationProps} props 
 */
export const ProductPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  useEffect(() => {
    console.log(currentPage);
  }, [currentPage])

  return (
    <div className="w-full pt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage !== 1 && (
              <PaginationPrevious
                to='#'
                onClick={() => setCurrentPage((p) => p - 1)}
              />
            )}
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                  to='#'
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            {currentPage !== totalPages && (
              <PaginationNext
                to='#'
                onClick={() => setCurrentPage((p) => p + 1)}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
