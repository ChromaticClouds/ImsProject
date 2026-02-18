import { usePoListContext } from '@/features/purchase-order/providers/po-list-provider.jsx';
import { usePoParamStore } from '@/features/purchase-order/stores/use-po-param-store.js';
import { useIsMobile } from '@/hooks/use-mobile.js';
import { BadgeCheckIcon } from 'lucide-react';
import { BadgeMinusIcon } from 'lucide-react';

const formatNumber = (n) => Number(n || 0).toLocaleString();

export const PoListSummary = () => {
  const isMobile = useIsMobile();
  const { page, summary } = usePoListContext();

  const view = usePoParamStore((s) => s.view);

  return view === 'DRAFT' ? (
    <div className='hidden md:block'>
      <div className='text-sm text-muted-foreground'>
        <span>{page?.totalElements}건</span>
        <span className='ml-4'>총수량 {formatNumber(summary?.totalCount)}</span>
      </div>
    </div>
  ) : (
    <div className='hidden md:flex flex-col gap-1 text-sm text-muted-foreground'>
      <div>
        <span>{page?.totalElements}건</span>
        <span className='ml-4'>총수량 {formatNumber(summary?.totalCount)}</span>
      </div>
      {!isMobile && (
        <span>
          <span className='flex gap-2 items-center'>
            <BadgeMinusIcon size={16} />
            <span>: 입고 대기</span>
          </span>

          <span className='flex gap-2 items-center'>
            <BadgeCheckIcon size={16} />
            <span>: 입고 완료</span>
          </span>
        </span>
      )}
    </div>
  );
};
