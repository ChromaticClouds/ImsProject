import { ReceiveOrderListContainer } from '@/features/receive-order/components/receive-order-list-container.jsx';
import { ReceiveOrderList } from '@/features/receive-order/components/receive-order-list.jsx';
import { ReceiveOrderSearch } from '@/features/receive-order/components/receive-order-search.jsx';
import { ReceiveOrderTableProvider } from '@/features/receive-order/providers/receive-order-table-provider.jsx';
import { useState } from 'react';

export const ReceiveOrder = () => {
  const [searchCond, setSearchCond] = useState({
    search: null,
    fromDate: null,
    toDate: null,
  });

  return (
    <div className='flex flex-col gap-3'>
      <ReceiveOrderListContainer>
        <ReceiveOrderSearch onSearch={setSearchCond} />
        <ReceiveOrderTableProvider>
          <ReceiveOrderList searchCond={searchCond} />
        </ReceiveOrderTableProvider>
      </ReceiveOrderListContainer>
    </div>
  );
};
