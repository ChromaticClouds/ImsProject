// @ts-check

/**
 * Components
 */
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';

/**
 * Assets
 */
import { SearchIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useProductSearchStore } from '@/features/product/stores/use-product-search-store.js';
import { useProductSearch } from '@/features/product/hooks/use-product-search.js';
import { useAdjustListStore } from '@/features/adjust/stores/use-adjust-list-store.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.js';

export const AdjustProductSearch = () => {
  const { data } = useProductSearch();
  const { isOpen, setIsOpen, keyword, setKeyword } = useProductSearchStore();

  const { addProduct } = useAdjustListStore();

  return (
    <div className='relative w-full max-w-120'>
      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <PopoverTrigger asChild>
          <div className='w-full'>
            <InputGroup>
              <InputGroupInput
                placeholder='제품 검색...'
                size={48}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className='pr-10'
              />
              <InputGroupAddon>
                <SearchIcon className='w-5 h-5 text-muted-foreground' />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </PopoverTrigger>

        <PopoverContent
          align='start'
          className='p-0 w-(--radix-popover-trigger-width)'
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className='max-h-80 overflow-y-auto'>
            {data?.data?.length ? (
              data.data.map((v) => (
                <div
                  key={v.id}
                  className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted transition-colors'
                  onMouseDown={() => {
                    addProduct(v);
                    setIsOpen(false);
                  }}
                >
                  <img
                    src={v.imageUrl || '/placeholder.png'}
                    className='w-10 h-10 rounded object-cover shrink-0'
                  />
                  <div className='flex flex-col min-w-0'>
                    <span className='text-sm font-medium truncate'>
                      {v.name}
                    </span>
                    <span className='text-xs text-muted-foreground truncate'>
                      {v.brand} · 재고 {v.count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className='px-4 py-6 text-sm text-center text-muted-foreground'>
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
