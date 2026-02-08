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
import { useDebounce } from '@/hooks/use-debounce.js';

/**
 * Assets
 */
import { SearchIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useState } from 'react';
import { useOrderProductSearch } from '../hooks/use-order-product-search.js';
import { OrderPostSearchList } from './order-post-search-list.jsx';

export const OrderPostSearch = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const debounced = useDebounce(input, 500);

  const { data, isFetching } = useOrderProductSearch(debounced, open);

  const products = data?.data ?? [];

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
            side='bottom'
            className='p-0 w-(--radix-popover-trigger-width)'
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <OrderPostSearchList
              products={products}
              isFetching={isFetching}
              onClick={() => setOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </CardFooter>
  );
};
