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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.js';
import { useAdjustContext } from '../providers/adjust-provider.jsx';
import { addOrIncreaseProduct } from '../healper/index.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';

export const AdjustProductSearch = () => {
  const { input, setInput } = useProductSearch();
  const { isOpen, setIsOpen } = useProductSearchStore();

  const { form, products = [] } = useAdjustContext();

  return (
    <div className='relative w-full max-w-120'>
      <Popover
        open={isOpen}
        modal={true}
        onOpenChange={setIsOpen}
      >
        <PopoverTrigger asChild>
          <div className='w-full'>
            <InputGroup>
              <InputGroupInput
                placeholder='제품 검색...'
                size={48}
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
          side='bottom'
          className='p-0 w-(--radix-popover-trigger-width)'
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className='max-h-80 overflow-y-auto'>
            {products.length > 0 ? (
              products.map((product) => (
                <button
                  key={product.id}
                  type='button'
                  className='w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors'
                  onClick={() => {
                    addOrIncreaseProduct(form, product);
                    setIsOpen(false);
                  }}
                >
                  <Avatar className='w-14 h-14 rounded-lg'>
                    <AvatarImage
                      src={product.imageUrl}
                      alt={product.name}
                      className='object-cover'
                    />
                    <AvatarFallback className='rounded-lg text-xs'>
                      {product.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col min-w-0'>
                    <span className='text-sm font-medium truncate'>
                      {product.name}
                    </span>
                    <span className='text-xs text-muted-foreground truncate'>
                      {product.brand} · 재고 {product.count}
                    </span>
                  </div>
                </button>
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
