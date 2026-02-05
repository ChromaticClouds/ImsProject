import { AppDateRangePicker } from '@/components/common/app-date-range-picker.jsx';
import { Label } from '@/components/ui/label.js';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.js';
import { useState } from 'react';



export const AdjustPicker = () => {
  const [value, setValue] = useState({
    from: new Date(),
    to: new Date()
  });

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex gap-3 items-center'>
        <span>날짜선택</span>
        <AppDateRangePicker
          value={value}
          onChange={(e) => setValue(e)}
        />
      </div>
      <div className='flex gap-3 items-center'>
        <span>조정종류</span>
        <RadioGroup
          defaultValue='plus'
          className='flex gap-24'
        >
          <div className='flex items-center gap-3'>
            <RadioGroupItem
              value='plus'
              id='plus'
            />
            <Label htmlFor='plus'>증가</Label>
          </div>
          <div className='flex items-center gap-3'>
            <RadioGroupItem
              value='minus'
              id='minus'
            />
            <Label htmlFor='minus'>감소</Label>
          </div>
        </RadioGroup>
      </div>
    </section>
  );
};
