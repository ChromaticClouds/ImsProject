import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ChevronRightIcon, PaperclipIcon, PinIcon } from 'lucide-react';

import type { NoticeItem } from '@/features/main/types';

/**
 * 중요 공지 뱃지
 */
const PinnedBadge = () => {
  return (
    <Badge
      variant='secondary'
      className='gap-1 bg-primary/10 px-1.5 py-0 text-[11px] font-medium text-primary hover:bg-primary/10'
    >
      <PinIcon />
      <span>중요</span>
    </Badge>
  );
};

export const NoticeRow = ({
  item,
  onClick,
}: {
  item: NoticeItem;
  onClick: () => void;
}) => {
  return (
    <div
      role='button'
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      aria-label={`${item.isPinned ? '중요 공지: ' : ''}${item.title}`}
      className={[
        'group flex cursor-pointer items-stretch border-b last:border-b-0',
        'transition-colors',
        item.isPinned
          ? 'bg-primary/5 hover:bg-primary/10'
          : 'hover:bg-muted/50',
      ].join(' ')}
    >
      {/* 좌측 컬러 바 — 중요 공지만 */}
      <div
        className={[
          'w-0.75 shrink-0',
          item.isPinned ? 'bg-primary' : 'bg-transparent',
        ].join(' ')}
        aria-hidden='true'
      />

      {/* 본문 */}
      <div className='min-w-0 flex-1 px-3 py-2.5'>
        <div className='mb-1 flex items-center gap-1.5'>
          {item.isPinned && <PinnedBadge />}
          <p className='truncate text-sm font-medium'>{item.title}</p>
        </div>
        <div className='flex items-center gap-3'>
          <span className='flex items-center gap-1 text-xs text-muted-foreground'>
            <CalendarIcon
              className='size-3'
              aria-hidden='true'
            />
            {item.date}
          </span>
        </div>
      </div>

      {/* 우측 아이콘 */}
      <div className='flex shrink-0 items-center gap-1.5 pr-3'>
        {item.hasAttachment && (
          <PaperclipIcon
            className='size-3.5 text-muted-foreground'
            aria-label='첨부파일 있음'
          />
        )}
        <ChevronRightIcon
          className='size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5'
          aria-hidden='true'
        />
      </div>
    </div>
  );
};
