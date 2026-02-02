// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import { FieldError } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.js';
import { SupplierItemsSection } from '@/features/vendor/components/supplier-items-section.jsx';

/**
 * Hooks
 */
import { usePhoneFormat } from '@/features/vendor/hooks/use-phone-format.js';
import { useSupplierItems } from '@/features/vendor/hooks/use-supplier-items.js';
import { useVendorForm } from '@/features/vendor/hooks/use-vendor-form.js';

export function VendorCreatePage() {
  const { normalizePhone } = usePhoneFormat();
  const form = useVendorForm();

  const supplierItems = useSupplierItems();

  return (
    <div className='max-w-2xl mx-auto space-y-8'>
      <h1 className='text-2xl font-semibold'>거래처 등록</h1>

      <form
        className='space-y-8'
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* ===== 기본 정보 ===== */}
        <div className='space-y-6'>
          {/* 구분 */}
          <div className='space-y-2'>
            <Label className='font-medium'>구분</Label>

            <form.Field name='type'>
              {(field) => (
                <RadioGroup
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(
                      /** @type {'Seller' | 'Supplier'} */ (value),
                    )
                  }
                  className='flex gap-4'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='Supplier'
                      id='vendor-type-supplier'
                    />
                    <Label htmlFor='vendor-type-supplier'>공급처</Label>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='Seller'
                      id='vendor-type-seller'
                    />
                    <Label htmlFor='vendor-type-seller'>판매처</Label>
                  </div>
                </RadioGroup>
              )}
            </form.Field>
          </div>
          {/* 대표자명 */}
          <form.Field name='bossName'>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <div className='space-y-2'>
                  <Label>대표자명</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='2~10자'
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>
          {/* 거래처명 */}
          <form.Field name='vendorName'>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <div className='space-y-2'>
                  <Label>거래처명</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>
          {/* 전화번호 */}
          <form.Field name='telephone'>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <div className='space-y-2'>
                  <Label>전화번호</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(normalizePhone(e.target.value))
                    }
                    onBlur={field.handleBlur}
                    placeholder='010-1234-5678'
                    inputMode='numeric'
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>
          {/* 이메일 */}
          <form.Field name='email'>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <div className='space-y-2'>
                  <Label>이메일</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='1234@gmail.com'
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>
          {/* 주소 */}
          <form.Field name='address'>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <div className='space-y-2'>
                  <Label>주소</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>
          {/* 메모 */}
          <form.Field name='memo'>
            {(field) => (
              <div className='space-y-2'>
                <Label>메모</Label>
                <Input
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.values.type}>
            {(vendorType) => (
              <SupplierItemsSection
                vendorType={vendorType}
                {...supplierItems}
              />
            )}
          </form.Subscribe>
        </div>

        {/* 버튼 영역 */}
        <form.Subscribe
          selector={(state) => ({
            isTouched: state.isTouched,
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ isTouched, canSubmit, isSubmitting }) => (
            <div className='flex justify-end'>
              <Button
                type='submit'
                disabled={!isTouched || !canSubmit || isSubmitting}
              >
                {isSubmitting ? '등록 중...' : '등록'}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
