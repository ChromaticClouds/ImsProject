import { ReceiveOrderListContainer } from '@/features/receive-order/components/receive-order-list/receive-order-list-container.jsx';
import { ReceiveOrderList } from '@/features/receive-order/components/receive-order-list/receive-order-list.jsx';
import { ReceiveOrderPagination } from '@/features/receive-order/components/receive-order-list/receive-order-pagination.jsx';
import { ReceiveOrderSearch } from '@/features/receive-order/components/receive-order-list/receive-order-search.jsx';
import { ReceiveOrderTableProvider } from '@/features/receive-order/providers/receive-order-table-provider.jsx';
import { RoListProvider } from '@/features/receive-order/providers/ro-list-provider.jsx';

export const ReceiveOrder = () => {
  return (
    <div className='flex flex-col gap-3'>
      <ReceiveOrderListContainer>
        <ReceiveOrderSearch />
        <RoListProvider>
          <ReceiveOrderTableProvider>
            <ReceiveOrderList />
            <ReceiveOrderPagination />
          </ReceiveOrderTableProvider>
        </RoListProvider>
      </ReceiveOrderListContainer>
    </div>
  );
};
