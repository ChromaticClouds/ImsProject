import { CardFooter } from '@/components/ui/card.js';

export const AdjustFooter = () => {
  return (
    <CardFooter className='border-t'>
      <div className='w-full flex justify-between'>
        <span>0개 품목</span>
        <span>총수량 0</span>
      </div>
    </CardFooter>
  );
};
