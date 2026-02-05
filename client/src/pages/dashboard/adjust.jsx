import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';
import { AdjustHeader } from '@/features/adjust/components/adjust-header.jsx';
import { AdjustList } from '@/features/adjust/components/adjust-list.jsx';
import { AdjustPicker } from '@/features/adjust/components/adjust-picker.jsx';

export const Adjust = () => {
  return (
    <div className='w-full flex flex-col'>
      <AppHeader
        title='재고 조정'
        description='재고 불일치 여부를 조정하기 위한 페이지입니다'
      />
      <AdjustPicker />
      <div className='mt-6'>
        <Card>
          <AdjustHeader />
          <AdjustList />
        </Card>
      </div>
    </div>
  );
};
