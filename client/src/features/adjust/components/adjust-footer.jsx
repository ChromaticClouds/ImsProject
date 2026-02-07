// @ts-check

import { CardFooter } from '@/components/ui/card.js';
import { useAdjustContext } from '../providers/adjust-provider.jsx';

export const AdjustFooter = () => {
  const form = useAdjustContext();

  return (
    <form.Subscribe
      selector={(state) => state.values.products}
    >
      {(products) => {
        const total = products.reduce((a, b) => a + b.adjustCount, 0);

        return (
          <CardFooter className='border-t'>
            <div className='w-full flex justify-between'>
              <span>{products.length}개 품목</span>
              <span>총 조정 수량 {total}</span>
            </div>
          </CardFooter>
        );
      }}
    </form.Subscribe>
  );
};
