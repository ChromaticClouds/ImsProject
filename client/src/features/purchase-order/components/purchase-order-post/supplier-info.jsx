// @ts-check

import { FieldLabel, FieldSet } from '@/components/ui/field.js';
import { FieldContainer } from './field-container.jsx';
import { usePoContext } from '../../providers/purchase-order-post-provider.jsx';
import { Input } from '@/components/ui/input.js';
import { SUPPLIER_FIELDS } from '../../constants/index.js';

export const SupplierInfo = () => {
  const { supplier } = usePoContext();

  console.log(supplier);

  return (
    <FieldSet>
      <p className='text-xl font-semibold tracking-tight'>공급처 정보</p>
      <FieldLabel className='text-muted-foreground'>
        공급처를 먼저 선택해주세요
      </FieldLabel>

      <div className='grid grid-cols-2 gap-4'>
        {SUPPLIER_FIELDS.map((field) => (
          <FieldContainer
            key={field.key}
            name={field.name}
            label={field.label}
          >
            <Input
              value={supplier?.[field.key] ?? ''}
              disabled
            />
          </FieldContainer>
        ))}
      </div>
    </FieldSet>
  );
};
