import { CardFooter } from '@/components/ui/card.js';
import { useUserList } from './user-provider.jsx';
import { useSearchParams } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination.js';

export const UserPagination = () => {
  const { page, totalPages } = useUserList();
  const [params, setParams] = useSearchParams();

  const goPage = (p) => {
    params.set('page', String(p));
    setParams(params);
  };

  if (totalPages <= 1) return null;

  return (
    <CardFooter>
      <Pagination>
        <PaginationContent>
          {/* 이전 */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => goPage(page - 1)}
              aria-disabled={page === 0}
            />
          </PaginationItem>

          {/* 페이지 번호들 */}
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={i === page}
                onClick={() => goPage(i)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* 다음 */}
          <PaginationItem>
            <PaginationNext
              onClick={() => goPage(page + 1)}
              aria-disabled={page === totalPages - 1}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </CardFooter>
  );
};
