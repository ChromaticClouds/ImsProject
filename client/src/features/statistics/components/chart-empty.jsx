import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { BarChart3Icon, RefreshCwIcon } from 'lucide-react';

/**
 * @param {{
 *   title?: string,
 *   description?: string,
 *   actionLabel?: string,
 *   loadingLabel?: string,
 *   isRefreshing?: boolean,
 *   icon?: React.ReactNode,
 *   onRefresh?: () => void | Promise<void>,
 * }} props
 */
export const ChartEmpty = ({
  title = '데이터가 없습니다.',
  description = '선택한 조건에 해당하는 통계 데이터가 없습니다.',
  actionLabel = '다시 조회',
  loadingLabel = '조회 중...',
  isRefreshing = false,
  icon = <BarChart3Icon />,
  onRefresh,
}) => {
  return (
    <Empty className='h-full border-0 p-4 md:p-6'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>

      {onRefresh && (
        <EmptyContent>
          <Button
            variant='outline'
            size='sm'
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCwIcon className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? loadingLabel : actionLabel}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};
