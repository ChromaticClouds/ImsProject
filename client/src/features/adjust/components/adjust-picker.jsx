// @ts-check

import { useAdjustContext } from '../providers/adjust-provider.jsx';
import { AppDatePicker } from '@/components/common/app-date-picker.jsx';
import React from 'react';
import { FieldError } from '@/components/ui/field.js';

export const AdjustPicker = () => {
  const form = useAdjustContext();

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex gap-3 items-center'>
        <span>날짜선택</span>
        <form.Field name='date'>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <React.Fragment>
                <AppDatePicker
                  date={field.state.value}
                  setDate={(e) => field.handleChange(e)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </React.Fragment>
            );
          }}
        </form.Field>
      </div>
    </section>
  );
};
