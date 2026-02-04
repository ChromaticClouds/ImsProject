import { AppDatePicker } from '@/components/common/app-date-picker.jsx';
import { AppHeader } from '@/components/common/app-header.jsx';
import { Calendar } from '@/components/ui/calendar.js';

export const Adjust = () => {
  return (
    <div className='w-full flex flex-col'>
      <AppHeader
        title='재고 조정'
        description='재고 조정 페이지입니다'
      />
      <AppDatePicker />
    </div>
  );
};
