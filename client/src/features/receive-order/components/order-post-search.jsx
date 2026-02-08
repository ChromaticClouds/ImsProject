// @ts-check

/**
 * Components
 */
import { CardFooter } from '@/components/ui/card.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.js';

/**
 * Assets
 */
import { SearchIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useState } from 'react';
import { useOrderPostContext } from '../providers/receive-order-post-provider.jsx';

export const OrderPostSearch = () => {
  const [open, setOpen] = useState(false);

  const { } = useOrderPostContext();

  return (
    <CardFooter>
      <div className='relative w-full max-w-120'>
        <Popover
          open={open}
          onOpenChange={setOpen}
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
            className='p-0 w-(--radix-popover-trigger-width)'
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
                    <img
                      src={product.imageUrl || '/placeholder.png'}
                      className='w-10 h-10 rounded object-cover shrink-0'
                    />
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
    </CardFooter>
  );
};
