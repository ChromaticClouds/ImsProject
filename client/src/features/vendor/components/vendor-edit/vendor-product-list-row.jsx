// @ts-check

import { Input } from '@/components/ui/input.js';
import { BottleWineIcon, XIcon } from 'lucide-react';

/**
 * @import { useVendorEditForm } from '@/features/vendor/hooks/vendor-edit/use-vendor-edit-form.js';
 */

/**
 * @param {number | null | undefined} value
 * @returns {string}
 */
const formatPrice = (value) => {
  if (value == null || value === 0) return '';
  return value.toLocaleString('ko-KR');
};

/**
 * @param {string} raw
 * @returns {number | null}
 */
const parsePrice = (raw) => {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  return Number(digits);
};

/**
 * @param {{ imageUrl?: string; name: string }} props
 */
const Thumbnail = ({ imageUrl, name }) => (
  <div className='flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/40'>
    {imageUrl ? (
      <img
        src={imageUrl}
        alt={name}
        className='size-full object-cover'
      />
    ) : (
      <BottleWineIcon
        className='size-4 text-muted-foreground'
        aria-hidden='true'
      />
    )}
  </div>
);

/**
 * @param {{
 *   form: ReturnType<typeof useVendorEditForm>;
 *   item: import('@/features/vendor/types/index.js').VendorProductType;
 *   index: number;
 *   onRemove: () => void;
 * }} props
 */
export const VendorProductListRow = ({ form, item, index, onRemove }) => (
  <form.Field name={`items[${index}].purchasePrice`}>
    {(priceField) => {
      const missingPrice = !priceField.state.value;

      return (
        <div className='grid grid-cols-[36px_minmax(0,1fr)_128px_36px] items-center gap-2.5 p-3 sm:grid-cols-[36px_minmax(0,1fr)_160px_36px]'>
          <Thumbnail
            imageUrl={item.imageUrl}
            name={item.productName}
          />

          <div className='min-w-0'>
            <p className='truncate text-sm font-medium'>{item.productName}</p>
            <span className='text-xs text-muted-foreground'>
              {[item.brand, item.type].filter(Boolean).join(' · ')}
            </span>
          </div>

          <div className='relative'>
            <Input
              value={formatPrice(priceField.state.value)}
              onChange={(e) => {
                const parsed = parsePrice(e.target.value);
                priceField.handleChange(parsed ?? 0);
              }}
              onBlur={priceField.handleBlur}
              placeholder='단가 입력'
              inputMode='numeric'
              aria-label={`${item.productName} 구매 단가`}
              className={[
                'h-9 pr-7 text-right tabular-nums',
                missingPrice
                  ? 'border-destructive focus-visible:ring-destructive/30'
                  : '',
              ].join(' ')}
            />
            <span
              className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'
              aria-hidden='true'
            >
              원
            </span>
          </div>

          <button
            type='button'
            aria-label={`${item.productName} 삭제`}
            onClick={onRemove}
            className='flex size-9 items-center justify-center rounded-md border bg-muted text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive'
          >
            <XIcon
              className='size-3.5'
              aria-hidden='true'
            />
          </button>
        </div>
      );
    }}
  </form.Field>
);
