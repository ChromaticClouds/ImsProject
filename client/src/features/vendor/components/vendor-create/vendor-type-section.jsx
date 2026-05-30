export function VendorTypeSection({ type, onChangeType }) {
  return (
    <div className='rounded-2xl border bg-secondary p-4'>
      <div className='mb-3 flex items-center justify-between'>
        <div className='font-semibold'>구분</div>
      </div>

      <div className='flex flex-wrap items-center gap-6'>
        <label className='flex items-center gap-2 text-sm font-semibold'>
          <input
            type='radio'
            name='vendorType'
            checked={type === 'Supplier'}
            onChange={() => onChangeType('Supplier')}
            className='h-4 w-4 accent-primary'
          />
          <span>공급처</span>
        </label>

        <label className='flex items-center gap-2 text-sm font-semibold'>
          <input
            type='radio'
            name='vendorType'
            checked={type === 'Seller'}
            onChange={() => onChangeType('Seller')}
            className='h-4 w-4 accent-primary'
          />
          <span>판매처</span>
        </label>
      </div>
    </div>
  );
}
