import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { NoticeListContent } from '@/features/notice/components/notice-list-view/notice-list-content';
import { NoticeListPagination } from '@/features/notice/components/notice-list-view/notice-list-pagination';
import { NoticeListSearch } from '@/features/notice/components/notice-list-view/notice-list-search';
import type {
  NoticeListItem,
  NoticeListViewProps,
} from '@/features/notice/components/notice-list-view/notice-list-types';
import { PlusIcon } from 'lucide-react';

export type { NoticeListItem } from '@/features/notice/components/notice-list-view/notice-list-types';

export const NoticeListView = ({
  pinned,
  items,
  page = 1,
  totalPages = 5,
  searchValue = '',
  isLoading = false,
  isFetching = false,
  error,
  canCreate = true,
  onCreate,
  onSelectNotice,
  onPageChange,
  onRetry,
}: NoticeListViewProps) => {
  const notices: NoticeListItem[] = [...pinned, ...items];

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='border-b px-6 gap-0'>
        <div className='flex items-center justify-between'>
          <NoticeListSearch isFetching={isFetching} />

          <Button
            type='button'
            size='sm'
            disabled={!canCreate}
            onClick={onCreate}
          >
            <PlusIcon
              className='size-4'
              aria-hidden='true'
            />
            작성
          </Button>
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        <NoticeListContent
          notices={notices}
          searchValue={searchValue}
          isLoading={isLoading}
          error={error}
          onSelectNotice={onSelectNotice}
          onRetry={onRetry}
        />
      </CardContent>

      <CardFooter className='justify-center border-t px-4 py-4'>
        <NoticeListPagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </CardFooter>
    </Card>
  );
};
