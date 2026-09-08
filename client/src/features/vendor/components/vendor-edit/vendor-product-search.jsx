// @ts-check

import { Input } from '@/components/ui/input.js';
import { Kbd } from '@/components/ui/kbd.js';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover.js';
import { useItemsSearch } from '@/features/vendor/hooks/vendor-detail/use-items-search.js';
import { SearchIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { VendorProductSearchItem } from './vendor-product-search-item.jsx';
import { LoadingState } from '@/components/common/loading-state.jsx';

/**
 * @typedef {import('@/features/vendor/types/index.js').VendorProductType} VendorProductType
 */

/**
 * @param {{ currentVendorId?: number; selectedIds: Set<number>; onToggle: (result: VendorProductType) => void }} props
 */
export const VendorProductSearch = ({ currentVendorId, selectedIds, onToggle }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));

  const { data: itemsData, isFetching } = useItemsSearch({
    keyword: query,
    excludeAssigned: true,
    currentVendorId,
    enabled: open,
  });

  const results = (itemsData ?? []).filter(
    (/** @type {VendorProductType} */ item) => !selectedIds.has(item.productId),
  );

  return (
    <Popover open={open}>
      <PopoverAnchor asChild>
        <div className='relative flex items-center'>
          <SearchIcon
            className='pointer-events-none absolute left-3 size-4 text-muted-foreground'
            aria-hidden='true'
          />
          <Input
            ref={inputRef}
            id='product-search'
            placeholder='품목명, 브랜드, 주종으로 검색'
            className='h-10 pl-9 pr-16'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            aria-label='품목 검색'
            aria-expanded={open}
            aria-haspopup='listbox'
            autoComplete='off'
          />
          {open && (
            <Kbd className='pointer-events-none absolute right-3'>ESC</Kbd>
          )}
        </div>
      </PopoverAnchor>

      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={() => {
          setOpen(false);
          inputRef.current?.blur();
        }}
        className='flex w-(--radix-popover-trigger-width) flex-col gap-1 overflow-auto p-2'
        style={{ maxHeight: '320px' }}
        sideOffset={6}
      >
        <div className='flex items-center justify-between px-1 pb-1'>
          <span className='text-xs font-medium text-muted-foreground'>
            검색 결과
          </span>
          <span className='text-xs text-muted-foreground'>
            {results.length}개
          </span>
        </div>

        <div
          role='listbox'
          aria-label='품목 검색 결과'
          className='flex flex-col gap-2'
        >
          {isFetching ? (
            <LoadingState
              label='품목을 검색하는 중입니다.'
              className='py-6'
            />
          ) : results.length > 0 ? (
            results.map((/** @type {VendorProductType} */ result) => (
              <VendorProductSearchItem
                key={result.productId}
                result={result}
                isSelected={selectedIds.has(result.productId)}
                onSelect={() => onToggle(result)}
              />
            ))
          ) : (
            <div className='flex flex-col items-center gap-2 py-6 text-muted-foreground'>
              <SearchIcon
                className='size-5'
                aria-hidden='true'
              />
              <p className='text-sm'>검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
