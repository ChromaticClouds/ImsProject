// @ts-check

import { AppDateRangePicker } from '@/components/common/app-date-range-picker.jsx';
import { Label } from '@/components/ui/label.js';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.js';
import { useAdjustContext } from '@/features/adjust/providers/adjust-form-provider.jsx';
import { useAdjustFormStore } from '@/features/adjust/stores/use-adjust-form-store.js';

export const AdjustPicker = () => {
  const form = useAdjustContext();

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex gap-3 items-center'>
        <span>날짜선택</span>
        <form.Field name='date'>
          {(field) => (
            <AppDateRangePicker
              value={field.state.value}
              onChange={(e) =>
                field.handleChange(
                  e.from && e.to
                    ? { from: e.from, to: e.to }
                    : field.state.value,
                )
              }
            />
          )}
        </form.Field>
      </div>
      <div className='flex gap-3 items-center'>
        <span>조정 종류</span>
        <form.Field name='type'>
          {(field) => (
            <RadioGroup
              value={field.state.value}
              className='flex gap-24'
              onValueChange={field.handleChange}
            >
              <div className='flex items-center gap-3'>
                <RadioGroupItem
                  value='PLUS'
                  id='plus'
                />
                <Label htmlFor='plus'>증가</Label>
              </div>
              <div className='flex items-center gap-3'>
                <RadioGroupItem
                  value='MINUS'
                  id='minus'
                />
                <Label htmlFor='minus'>감소</Label>
              </div>
            </RadioGroup>
          )}
        </form.Field>
      </div>
    </section>
  );
};
