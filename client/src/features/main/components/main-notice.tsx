// @ts-check
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';
import { NoticeRow } from '@/features/main/components/notice-row.js';

/**
 * Api
 */
import { getNotices } from '@/features/notice/api';

/**
 * Assets
 */
import { ChevronRightIcon, MegaphoneIcon } from 'lucide-react';
import type { NoticeWidgetProps } from '@/features/main/types';
import { toNoticeItems } from '@/features/main/helpers/to-notice-items';

// ─────────────────────────────────────────────
// 서브 컴포넌트
// ─────────────────────────────────────────────

/**
 * 빈 상태
 */
function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center gap-2 py-9 text-muted-foreground'>
      <MegaphoneIcon
        className='size-6'
        aria-hidden='true'
      />
      <p className='text-sm'>등록된 공지사항이 없습니다.</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────

/**
 * @param {NoticeWidgetProps} props
 */
export const MainNotice = ({
  maxVisible = 8,
  onViewList,
  onClickItem,
  onViewAll,
}: NoticeWidgetProps) => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['main', 'notices'],
    queryFn: () => getNotices(1),
  });

  const items = useMemo(() => toNoticeItems(data), [data]);
  const visible = items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;
  const handleViewList = onViewList ?? (() => navigate('/dashboard/notice'));
  const handleViewAll = onViewAll ?? (() => navigate('/dashboard/notice'));
  const handleClickItem =
    onClickItem ?? ((id) => navigate(`/dashboard/notice/${id}`));

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='w-full border-b gap-0 overflow-hidden'>
        <div className='flex items-center justify-between'>
          <CardTitle className='truncate'>공지사항</CardTitle>

          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-7 shrink-0'
            aria-label='공지사항 목록으로 이동'
            title='공지사항 목록'
            onClick={handleViewList}
          >
            <ChevronRightIcon className='size-4' />
          </Button>
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        {isLoading ? (
          <div className='space-y-2 p-3'>
            <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
            <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
            <div className='h-10 w-full animate-pulse rounded-md bg-muted' />
          </div>
        ) : error ? (
          <div className='px-4 py-8 text-center text-sm text-muted-foreground'>
            공지사항을 불러오지 못했습니다.
          </div>
        ) : visible.length === 0 ? (
          <EmptyState />
        ) : (
          visible.map((item) => (
            <NoticeRow
              key={item.id}
              item={item}
              onClick={() => handleClickItem(item.id)}
            />
          ))
        )}
      </CardContent>

      {hasMore && (
        <CardFooter className='border-t p-0'>
          <button
            type='button'
            onClick={handleViewAll}
            className='flex w-full items-center justify-center gap-1 py-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground'
          >
            전체 보기
            <ChevronRightIcon
              className='size-3.5'
              aria-hidden='true'
            />
          </button>
        </CardFooter>
      )}
    </Card>
  );
};
