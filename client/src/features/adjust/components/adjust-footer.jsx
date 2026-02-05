import { CardFooter } from '@/components/ui/card.js';
import { useAdjustListStore } from '@/features/adjust/stores/use-adjust-list-store.js';

export const AdjustFooter = () => {
  const productsLength = useAdjustListStore((state) => state.products.length);

  const totalAdjustCount = useAdjustListStore((state) =>
    state.getTotalAdjustCount(),
  );

  return (
    <CardFooter className='border-t'>
      <div className='w-full flex justify-between'>
        <span>{productsLength}개 품목</span>
        <span>총 조정 수량 {totalAdjustCount}</span>
      </div>
    </CardFooter>
  );
};
