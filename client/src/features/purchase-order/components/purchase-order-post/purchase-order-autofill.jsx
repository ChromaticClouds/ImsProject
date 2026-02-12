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

export const PurchaseOrderAutofill = () => {
  const { sequence } = usePoContext();

  return (
    <FieldSet>
      <div className='w-full grid grid-cols-2 justify-between'>
        <FieldContainer
          name='sequence'
          label='발주 번호'
        >
          <InputGroup className='w-60'>
            <InputGroupInput
              disabled
              value={sequence}
            />
            <InputGroupAddon>
              <SquareArrowRightIcon />
            </InputGroupAddon>
          </InputGroup>
        </FieldContainer>

        <FieldContainer
          name='date'
          label='발주일'
        >
          <AppDatePicker
            disabled
            date={new Date()}
          />
        </FieldContainer>
      </div>
    </FieldSet>
  );
};
