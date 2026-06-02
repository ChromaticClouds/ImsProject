import { Badge } from '@/components/ui/badge';
import type { NoticeListItem } from '@/features/notice/components/notice-list-view/notice-list-types';
import {
  CalendarIcon,
  ChevronRightIcon,
  PaperclipIcon,
  PinIcon,
  UserRoundIcon,
} from 'lucide-react';

const getAuthorName = (notice: NoticeListItem) =>
  notice.author?.name ?? notice.userName ?? '-';

const NoticeBadge = () => (
  <Badge
    variant='secondary'
    className='gap-1 bg-primary/10 px-1.5 py-0 text-[11px] font-medium text-primary hover:bg-primary/10'
  >
    <PinIcon
      className='size-3'
      aria-hidden='true'
    />
    중요
  </Badge>
);

export const NoticeListRow = ({
  notice,
  onSelectNotice,
}: {
  notice: NoticeListItem;
  onSelectNotice?: (id: NoticeListItem['id']) => void;
}) => (
  <button
    type='button'
    className={[
      'group flex w-full items-stretch border-b text-left transition-colors last:border-b-0',
      notice.pinned ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50',
    ].join(' ')}
    onClick={() => onSelectNotice?.(notice.id)}
  >
    <div
      className={[
        'w-0.75 shrink-0',
        notice.pinned ? 'bg-primary' : 'bg-transparent',
      ].join(' ')}
      aria-hidden='true'
    />

    <div className='flex w-16 shrink-0 items-center justify-center text-xs font-medium text-muted-foreground'>
      {notice.id}
    </div>

    <div className='min-w-0 flex-1 px-2 py-3'>
      <div className='flex min-w-0 items-center gap-2'>
        {notice.pinned && <NoticeBadge />}
        <p className='truncate text-sm font-semibold'>{notice.title}</p>
      </div>

      <div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
        <span className='inline-flex items-center gap-1'>
          <UserRoundIcon
            className='size-3'
            aria-hidden='true'
          />
          {getAuthorName(notice)}
        </span>
        <span className='inline-flex items-center gap-1'>
          <CalendarIcon
            className='size-3'
            aria-hidden='true'
          />
          {notice.createdAt}
        </span>
      </div>
    </div>

    <div className='flex shrink-0 items-center gap-3 px-4 text-muted-foreground'>
      {notice.hasAttachment && (
        <PaperclipIcon
          className='size-4'
          aria-label='첨부파일 있음'
        />
      )}
      <ChevronRightIcon
        className='size-4 transition-transform group-hover:translate-x-0.5'
        aria-hidden='true'
      />
    </div>
  </button>
);
