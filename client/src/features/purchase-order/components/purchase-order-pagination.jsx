// @ts-check
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { BadgeCheckIcon } from 'lucide-react';

/** @param {{page:any, onChange:(p:number)=>void}} props */
export const PurchaseOrderPagination = ({ page, onChange }) => {
  const currentPage = Number(page?.number || 1);
  const totalPages = Number(page?.totalPages || 1);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className='w-full pt-4'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage > 1 ? (
              <PaginationPrevious to='#' onClick={() => onChange(currentPage - 1)} />
            ) : null}
          </PaginationItem>

          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                to='#'
                isActive={p === currentPage}
                onClick={() => onChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            {currentPage < totalPages ? (
              <PaginationNext to='#' onClick={() => onChange(currentPage + 1)} />
            ) : null}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
