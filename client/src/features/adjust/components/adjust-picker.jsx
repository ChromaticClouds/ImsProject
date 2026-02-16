// @ts-check

import { useAdjustContext } from '../providers/adjust-provider.jsx';
import { AppDatePicker } from '@/components/common/app-date-picker.jsx';
import React from 'react';
import { FieldError } from '@/components/ui/field.js';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.js';
import { Label } from '@/components/ui/label.js';

export const AdjustPicker = () => {
  const { form } = useAdjustContext();

  return (
    <section className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 md:grid-cols-[120px_1fr] items-center'>
        <span>조정일</span>
        <AppDatePicker
          date={new Date()}
          disabled
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-[120px_1fr] items-center'>
        <span>조정선택</span>
        <form.Field name='type'>
          {(field) => (
            <RadioGroup
              className='w-48 flex justify-between'
              defaultValue={field.state.value}
              onValueChange={
                /** @param {'PLUS' | 'MINUS'} e */
                (e) => field.handleChange(e)
              }
            >
              <div className='flex gap-3 items-center'>
                <RadioGroupItem
                  value='PLUS'
                  id='plus'
                />
                <Label htmlFor='plus'>증가</Label>
              </div>
              <div className='flex gap-3 items-center'>
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
