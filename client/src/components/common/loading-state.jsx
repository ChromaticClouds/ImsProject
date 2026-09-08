// @ts-check

import { Spinner } from '@/components/ui/spinner.js';
import { cn } from '@/lib/utils.js';

const variantClassNames = {
  page: 'min-h-[min(28rem,60vh)] w-full flex-col gap-3 p-6',
  section: 'min-h-24 w-full gap-2 p-4',
  inline: 'min-h-0 w-auto justify-start gap-2 p-0',
};

/**
 * 데이터 로딩 상태를 일관된 간격, 색상, 접근성 안내로 표시합니다.
 *
 * @param {React.ComponentProps<'div'> & {
 *   label?: string,
 *   variant?: keyof typeof variantClassNames,
 *   spinnerClassName?: string,
 * }} props
 */
export const LoadingState = ({
  label = '불러오는 중입니다.',
  variant = 'section',
  className,
  spinnerClassName,
  ...props
}) => (
  <div
    role='status'
    aria-live='polite'
    aria-atomic='true'
    aria-label={label}
    className={cn(
      'flex items-center justify-center text-muted-foreground',
      variantClassNames[variant],
      className,
    )}
    {...props}
  >
    <Spinner
      role='presentation'
      aria-hidden='true'
      className={cn(variant === 'page' ? 'size-6' : 'size-4', spinnerClassName)}
    />
    <span className={cn('text-sm', variant === 'page' && 'font-medium')}>
      {label}
    </span>
  </div>
);
