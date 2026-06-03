// @ts-check

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircleIcon, ExternalLinkIcon, PinIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * @typedef {import('@/features/notice/api').PinnedNoticeSummary} PinnedNoticeSummary
 */

/**
 * @param {{
 *   notices?: PinnedNoticeSummary[];
 *   isLoading?: boolean;
 *   isError?: boolean;
 *   checkedIds?: number[];
 *   onCheckedChange?: (id: number, checked: boolean) => void;
 * }} props
 */
export const PinnedNoticeSummaryList = ({
  notices = [],
  isLoading = false,
  isError = false,
  checkedIds = [],
  onCheckedChange,
}) => {
  const checkedIdSet = new Set(checkedIds);

  return (
    <section className='rounded-md border bg-muted/20 px-4 py-3'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <PinIcon
            className='size-4 text-muted-foreground'
            aria-hidden='true'
          />
          <h3 className='text-sm font-medium'>현재 중요 공지</h3>
          <Badge
            variant='secondary'
            className='text-[11px]'
          >
            {notices.length} / 3
          </Badge>
        </div>
        <p className='text-xs text-muted-foreground'>
          체크 해제한 공지는 등록 시 중요 공지에서 제외됩니다.
        </p>
      </div>

      <div className='mt-3'>
        {isLoading ? (
          <div className='flex items-center gap-2 py-3 text-sm text-muted-foreground'>
            <Spinner
              className='size-4'
              aria-label='중요 공지 조회 중'
            />
            중요 공지를 확인하는 중입니다.
          </div>
        ) : isError ? (
          <div className='flex items-center gap-2 py-3 text-sm text-destructive'>
            <AlertCircleIcon
              className='size-4'
              aria-hidden='true'
            />
            중요 공지 목록을 불러오지 못했습니다.
          </div>
        ) : notices.length === 0 ? (
          <p className='py-3 text-sm text-muted-foreground'>
            현재 등록된 중요 공지가 없습니다.
          </p>
        ) : (
          <ul className='divide-y rounded-md border bg-background'>
            {notices.map((notice) => (
              <li
                key={notice.id}
                className='flex items-center justify-between gap-3 px-3 py-2'
              >
                <div className='flex min-w-0 items-center gap-3'>
                  <Checkbox
                    id={`pinned-notice-${notice.id}`}
                    checked={checkedIdSet.has(notice.id)}
                    onCheckedChange={(checked) =>
                      onCheckedChange?.(notice.id, checked === true)
                    }
                    aria-label={`${notice.title} 중요 공지 유지`}
                  />
                  <div className='min-w-0'>
                    <label
                      htmlFor={`pinned-notice-${notice.id}`}
                      className='block cursor-pointer truncate text-sm font-medium'
                    >
                      {notice.title}
                    </label>
                    <p className='text-xs text-muted-foreground'>
                      {notice.author?.name ?? '작성자 정보 없음'}
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='size-8 shrink-0'
                >
                  <Link
                    to={`/dashboard/notice/${notice.id}`}
                    aria-label={`${notice.title} 상세 보기`}
                  >
                    <ExternalLinkIcon
                      className='size-4'
                      aria-hidden='true'
                    />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
