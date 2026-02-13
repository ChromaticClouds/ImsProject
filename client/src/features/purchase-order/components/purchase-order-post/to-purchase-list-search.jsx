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
import { SearchIcon } from 'lucide-react';
import { usePoContext } from '../../providers/purchase-order-post-provider.jsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.js';
import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce.js';
import { PoSearchList } from './po-search-list.jsx';
import { FieldDescription } from '@/components/ui/field.js';
import { AlertCircleIcon } from 'lucide-react';

export const ToPurchaseListSearch = () => {
  /**
   * 컨텍스트에서 가져온 공급처 아이디
   */
  const { selectedVendorId } = usePoContext();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const debounced = useDebounce(input, 500);

  return (
    <CardFooter className='border-t flex items-center gap-3'>
      <div className='relative w-full max-w-120'>
        {selectedVendorId ? (
          <Popover
            open={open}
            onOpenChange={setOpen}
            modal={true}
          >
            <PopoverTrigger asChild>
              <InputGroup>
                <InputGroupInput
                  placeholder='제품 검색...'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className='pr-10'
                />
                <InputGroupAddon>
                  <SearchIcon className='w-5 h-5 text-muted-foreground' />
                </InputGroupAddon>
              </InputGroup>
            </PopoverTrigger>

            <PopoverContent
              align='start'
              side='bottom'
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              className='p-0 w-(--radix-popover-trigger-width)'
            >
              <PoSearchList
                open={open}
                selectedVendorId={selectedVendorId}
                debounced={debounced}
                onClick={() => setOpen(false)}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <InputGroup>
            <InputGroupInput
              placeholder='공급처를 먼저 지정해주세요'
              disabled
              data-aria-hidden={false}
              className='pr-10'
            />
            <InputGroupAddon>
              <SearchIcon className='w-5 h-5 text-muted-foreground' />
            </InputGroupAddon>
          </InputGroup>
        )}
      </div>
      <FieldDescription className='flex items-center gap-2'>
        <AlertCircleIcon size={16} />
        공급처를 먼저 선택해야 품목을 등록할 수 있습니다.
      </FieldDescription>
    </CardFooter>
  );
};
