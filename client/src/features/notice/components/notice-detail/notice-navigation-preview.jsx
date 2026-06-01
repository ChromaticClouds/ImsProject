// @ts-check

/**
 * @typedef {object} NoticeNavigationPreviewProps
 * @property {{ id: number, title: string } | null} [previousNotice]
 * @property {{ id: number, title: string } | null} [nextNotice]
 * @property {(id: number) => void} onMove
 */

/**
 * @param {NoticeNavigationPreviewProps} props
 */
export const NoticeNavigationPreview = ({
  previousNotice,
  nextNotice,
  onMove,
}) => (
  <div className='grid gap-3 md:grid-cols-2'>
    <button
      type='button'
      className='rounded-md border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60'
      disabled={!previousNotice}
      onClick={() => {
        if (previousNotice) onMove(previousNotice.id);
      }}
    >
      <p className='text-xs text-muted-foreground'>← 이전 공지</p>
      <p className='mt-1 truncate text-sm font-medium'>
        {previousNotice
          ? `#${previousNotice.id} ${previousNotice.title}`
          : '이전 공지가 없습니다'}
      </p>
    </button>

    <button
      type='button'
      className='rounded-md border bg-card px-4 py-3 text-right transition-colors hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60'
      disabled={!nextNotice}
      onClick={() => {
        if (nextNotice) onMove(nextNotice.id);
      }}
    >
      <p className='text-xs text-muted-foreground'>다음 공지 →</p>
      <p className='mt-1 truncate text-sm font-medium'>
        {nextNotice
          ? `#${nextNotice.id} ${nextNotice.title}`
          : '다음 공지가 없습니다'}
      </p>
    </button>
  </div>
);
