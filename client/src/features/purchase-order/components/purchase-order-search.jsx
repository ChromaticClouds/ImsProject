// src/features/purchase-order/components/purchase-order-search.jsx
// @ts-check
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group.js';
import { SearchIcon } from 'lucide-react';
import { usePurchaseOrderFilterStore } from '@/features/purchase-order/stores/use-purchase-order-filter-store.js';

export const PurchaseOrderSearch = () => {
  const { keyword, setKeyword } = usePurchaseOrderFilterStore();

  return (
    <div className='relative w-full max-w-120'>
      <InputGroup>
        <InputGroupInput
          placeholder='발주번호/거래처ID/제품ID 검색...'
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
  );
};
