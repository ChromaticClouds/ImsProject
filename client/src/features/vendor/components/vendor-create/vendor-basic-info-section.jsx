import { Textarea } from '@/components/ui/textarea';
import { VENDOR_CREATE_FIELDS } from '@/features/vendor/hooks/use-vendor-create-form';
import { VendorFormField } from './vendor-form-field.jsx';

export function VendorBasicInfoSection({
  form,
  touched,
  errors,
  setField,
  markTouched,
}) {
  return (
    <div className='rounded-2xl border bg-secondary p-4'>
      <div className='mb-3 font-semibold'>기본 정보</div>

      <div className='grid grid-cols-12 gap-3'>
        <VendorFormField
          label='대표자명'
          required
          value={form.bossName}
          onChange={setField(VENDOR_CREATE_FIELDS.bossName)}
          onBlur={markTouched(VENDOR_CREATE_FIELDS.bossName)}
          placeholder='2~10자'
          error={touched.bossName ? errors.bossName : undefined}
          colSpan='col-span-12 md:col-span-6'
        />

        <VendorFormField
          label='거래처명'
          required
          value={form.vendorName}
          onChange={setField(VENDOR_CREATE_FIELDS.vendorName)}
          onBlur={markTouched(VENDOR_CREATE_FIELDS.vendorName)}
          placeholder='거래처명을 입력'
          error={touched.vendorName ? errors.vendorName : undefined}
          colSpan='col-span-12 md:col-span-6'
        />

        <VendorFormField
          label='전화번호'
          required
          value={form.telephone}
          onChange={setField(VENDOR_CREATE_FIELDS.telephone)}
          onBlur={markTouched(VENDOR_CREATE_FIELDS.telephone)}
          placeholder='010-1234-5678'
          inputMode='numeric'
          error={touched.telephone ? errors.telephone : undefined}
          colSpan='col-span-12 md:col-span-6'
        />

        <VendorFormField
          label='이메일'
          required
          value={form.email}
          onChange={setField(VENDOR_CREATE_FIELDS.email)}
          onBlur={markTouched(VENDOR_CREATE_FIELDS.email)}
          placeholder='example@email.com'
          error={touched.email ? errors.email : undefined}
          colSpan='col-span-12 md:col-span-6'
        />

        <VendorFormField
          label='주소'
          required
          value={form.address}
          onChange={setField(VENDOR_CREATE_FIELDS.address)}
          onBlur={markTouched(VENDOR_CREATE_FIELDS.address)}
          placeholder='주소를 입력'
          error={touched.address ? errors.address : undefined}
          colSpan='col-span-12'
        />

        <div className='col-span-12'>
          <div className='mb-1 flex items-center justify-between'>
            <div className='text-sm font-semibold'>메모</div>
            <div className='text-xs text-muted-foreground'>선택</div>
          </div>
          <Textarea
            value={form.memo}
            onChange={setField(VENDOR_CREATE_FIELDS.memo)}
            placeholder='메모를 입력하세요.'
            rows={4}
            className='resize-none'
          />
        </div>
      </div>
    </div>
  );
}
