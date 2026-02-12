// @ts-check

/**
 * Components
 */
import { FieldSet } from '@/components/ui/field.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';
import { SquareArrowRightIcon } from 'lucide-react';
import { AppDatePicker } from '@/components/common/app-date-picker.jsx';
import { FieldContainer } from './field-container.jsx';

/**
 * Hooks
 */
import { usePoContext } from '../../providers/purchase-order-post-provider.jsx';
import { usePoFormContext } from '@/features/purchase-order/providers/po-post-form-provder.jsx';

export const PurchaseOrderAutofill = () => {
  const form = usePoFormContext();
  const { sequence } = usePoContext();

  return (
    <FieldSet className='flex flex-col gap-4'>
      <div className='w-full grid grid-cols-2 justify-between'>
        <FieldContainer name='sequence' label='발주 번호'>
          <InputGroup className='w-60'>
            <InputGroupInput disabled value={sequence} />
            <InputGroupAddon>
              <SquareArrowRightIcon />
            </InputGroupAddon>
          </InputGroup>
        </FieldContainer>

        <FieldContainer name='date' label='발주일'>
          <AppDatePicker
            disabled
            date={new Date()}
          />
        </FieldContainer>
      </div>
      <div className='w-full grid grid-cols-2 justify-between'>
        <form.Field name='date'>
          {(field) => (
            <FieldContainer name='date' label='납기일'>
              <AppDatePicker 
                date={field.state.value} 
                setDate={(e) => field.handleChange(e)} 
              />
            </FieldContainer>
          )}
        </form.Field>
      </div>
    </FieldSet>
  );
};
