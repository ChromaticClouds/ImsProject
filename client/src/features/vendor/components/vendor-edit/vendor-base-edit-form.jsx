// @ts-check

/**
 * Components
 */
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field.js';
import { VENDOR_TYPE_MAP, VENDOR_TYPE_STYLES } from '@/features/vendor/constants/index.js';

/**
 * Hooks
 */
import { useVendorEditForm } from '@/features/vendor/hooks/vendor-edit/use-vendor-edit-form.js';
import { Store } from 'lucide-react';
import { LockKeyhole } from 'lucide-react';

/**
 * @typedef {object} LabelPropsType
 * @property {string} label
 * @property {boolean} [required]
 */

/**
 * @param {LabelPropsType} props
 * @returns
 */
const LabelComponent = ({ label, required = true }) => {
  if (required) {
    return (
      <div>
        {label} <span className='text-orange-500'>*</span>
      </div>
    );
  }

  return <div>{label}</div>;
};

/**
 * @typedef {object} VendorBaseEditFormProps
 * @property {ReturnType<typeof useVendorEditForm>} form
 * @property {VendorDetail} vendor
 */

/**
 * @param {VendorBaseEditFormProps} props
 */
export const VendorBaseEditForm = ({ form, vendor }) => {
  const typeStyle =
    VENDOR_TYPE_STYLES[vendor.type] ?? VENDOR_TYPE_STYLES.Supplier;

  return (
    <FieldSet>
      <FieldLegend className='font-bold text-xl!'>기본 정보</FieldLegend>
      <FieldDescription>
        <span className='text-orange-500'>*</span> 표시는 필수 입력입니다.
      </FieldDescription>
      <FieldSeparator />
      <FieldGroup>
        <div className='space-y-2'>
          <h4 className='flex items-center gap-1.5 text-sm font-medium'>
            구분
          </h4>

          <div
            className={[
              'flex items-center gap-3 rounded-md border px-3 py-2.5',
              typeStyle.wrapper,
            ].join(' ')}
          >
            <div
              className={[
                'flex size-8 shrink-0 items-center justify-center rounded-md',
                typeStyle.icon,
              ].join(' ')}
            >
              <Store className='size-4' />
            </div>
            <div>
              <p className={['text-sm font-medium', typeStyle.title].join(' ')}>
                {VENDOR_TYPE_MAP[vendor.type]}
              </p>
              <p
                className={[
                  'flex items-center gap-1 text-xs',
                  typeStyle.description,
                ].join(' ')}
              >
                <LockKeyhole className='size-3' />
                수정할 수 없는 항목입니다
              </p>
            </div>
          </div>
        </div>
        <form.AppField name='vendorName'>
          {(field) => (
            <field.TextField label={<LabelComponent label='거래처명' />} />
          )}
        </form.AppField>
        <form.AppField name='telephone'>
          {(field) => (
            <field.TextField label={<LabelComponent label='전화번호' />} />
          )}
        </form.AppField>
        <form.AppField name='email'>
          {(field) => (
            <field.TextField label={<LabelComponent label='이메일' />} />
          )}
        </form.AppField>
        <form.AppField name='bossName'>
          {(field) => (
            <field.TextField label={<LabelComponent label='대표자명' />} />
          )}
        </form.AppField>
        <form.AppField name='address'>
          {(field) => (
            <field.TextField label={<LabelComponent label='주소' />} />
          )}
        </form.AppField>
        <form.AppField name='memo'>
          {(field) => (
            <field.TextField
              label={
                <LabelComponent
                  label='메모'
                  required={false}
                />
              }
            />
          )}
        </form.AppField>
      </FieldGroup>
    </FieldSet>
  );
};
