// @ts-check

import { Button } from '@/components/ui/button';
import { downloadFile } from '@/features/notice/api/notice';
import { DownloadIcon, FileIcon } from 'lucide-react';

/**
 * @param {string | undefined | null} path
 * @returns {string | undefined | null}
 */
const getFileName = (path) => path?.split('/').pop() ?? path;

/**
 * @typedef {object} NoticeAttachmentItemProps
 * @property {string} fileName
 */

/**
 * @param {NoticeAttachmentItemProps} props
 */
export const NoticeAttachmentItem = ({ fileName }) => {
  const displayName = getFileName(fileName);

  return (
    <div className='flex items-center gap-3 rounded-md bg-muted/30 px-3 py-2.5'>
      <div className='flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary'>
        <FileIcon
          className='size-4'
          aria-hidden='true'
        />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{displayName}</p>
      </div>
      <Button
        type='button'
        variant='outline'
        size='icon'
        className='size-8 shrink-0'
        onClick={async () => {
          await downloadFile(fileName);
        }}
      >
        <DownloadIcon
          className='size-4'
          aria-hidden='true'
        />
        <span className='sr-only'>{displayName} 다운로드</span>
      </Button>
    </div>
  );
};
