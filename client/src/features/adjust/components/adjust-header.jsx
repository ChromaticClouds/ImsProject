/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.js';

/**
 * Assets
 */
import { AdjustProductSearch } from './adjust-product-search.jsx';
import { useAdjustContext } from '../providers/adjust-provider.jsx';

export const AdjustHeader = () => {
  const form = useAdjustContext();

  return (
    <CardHeader className='border-b flex flex-col'>
      <div className='w-full flex justify-between'>
        <div className='flex flex-col gap-3 overflow-hidden'>
          <CardTitle className='text-nowrap'>제품목록</CardTitle>
          <CardDescription className='text-nowrap'>
            제품을 선택해주세요
          </CardDescription>
        </div>
        <div className='flex gap-3 items-center'>
          <AdjustProductSearch />

          <form.Field name='products'>
            {(field) => (
              <Button onClick={() => field.handleChange(() => [])}>
                전체 삭제
              </Button>
            )}
          </form.Field>
        </div>
      </div>
    </CardHeader>
  );
};
