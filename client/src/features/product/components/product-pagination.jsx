// @ts-check

import { CardFooter } from '@/components/ui/card.js';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useProductContext } from '../providers/product-provider.jsx';
import { useLocation } from 'react-router-dom';

export const ProductPagination = () => {
  const { content, pageResponse } = useProductContext();

  const location = useLocation();

  /** @param {number} page */
  const createPageLink = (page) => {
    const params = new URLSearchParams(location.search);
    params.set('page', String(page));
    return `${location.pathname}?${params.toString()}`;
  };

  return (
    content.length > 0 && pageResponse && (
      <CardFooter>
        <div className='w-full pt-4'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  to={createPageLink(pageResponse.page - 1)}
                  onClick={(e) => {
                    pageResponse.isFirst && e.preventDefault();
                  }}
                />
              </PaginationItem>

              {Array.from({ length: pageResponse.totalPages }).map(
                (_, page) => {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page + 1 === pageResponse.page}
                        to={createPageLink(page + 1)}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                },
              )}

              <PaginationItem>
                <PaginationNext
                  to={createPageLink(pageResponse.page + 1)}
                  onClick={(e) => {
                    pageResponse.isLast && e.preventDefault();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardFooter>
    )
  );
};
