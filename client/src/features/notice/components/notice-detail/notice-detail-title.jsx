// @ts-check

import { Badge } from '@/components/ui/badge';
import { PinIcon } from 'lucide-react';

/**
 * @typedef {object} NoticeDetailTitleProps
 * @property {boolean} pinned
 * @property {string} title
 */

/**
 * @param {NoticeDetailTitleProps} props
 */
export const NoticeDetailTitle = ({ pinned, title }) => (
  <div className='flex flex-col items-start gap-2'>
    {pinned && (
      <Badge className='gap-1.5 text-foreground'>
        <PinIcon
          className='size-3.5'
          aria-hidden='true'
        />
        중요 공지
      </Badge>
    )}
    <span>{title}</span>
  </div>
);
