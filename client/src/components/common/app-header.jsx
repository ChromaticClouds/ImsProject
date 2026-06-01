// @ts-check

import { Button } from '@/components/ui/button.js';
import { Separator } from '@/components/ui/separator.js';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * @typedef {object} AppHeaderType
 * @property {React.ReactNode} title
 * @property {React.ReactNode} [description]
 * @property {boolean} [allowBackward]
 * @property {() => void} [onBackward]
 * @property {React.ReactNode} [topDecoration]
 * @property {React.ReactNode} [asideDecoration]
 */

/**
 * @param {AppHeaderType} props
 */
export const AppHeader = ({
  title,
  description,
  allowBackward = false,
  onBackward,
  topDecoration,
  asideDecoration,
}) => {
  const navigate = useNavigate();

  return (
    <div className='w-full mt-18 mb-6 flex flex-col'>
      <div className='flex items-center gap-3'>
        {allowBackward && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={onBackward ?? (() => navigate(-1))}
          >
            <ArrowLeftIcon />
          </Button>
        )}

        {topDecoration}
      </div>
      <div
        className={`flex flex-col gap-3 md:flex-row md:items-end md:justify-between ${(allowBackward || topDecoration) && 'mt-2'}`}
      >
        <div className='flex flex-col gap-1'>
          <div className='text-2xl font-semibold tracking-tight'>{title}</div>

          {description && (
            <p className='text-sm text-muted-foreground'>{description}</p>
          )}
        </div>

        {asideDecoration}
      </div>

      <Separator className='mt-4' />
    </div>
  );
};
