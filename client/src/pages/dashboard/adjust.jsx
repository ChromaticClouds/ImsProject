import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';
import { AdjustAction } from '@/features/adjust/components/adjust-action.jsx';
import { AdjustFooter } from '@/features/adjust/components/adjust-footer.jsx';
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
          <AdjustFooter />
        </Card>
      </div>
      <AdjustAction />
    </div>
  );
};
