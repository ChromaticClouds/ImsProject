import { ReceiveOrderListContainer } from '@/features/receive-order/components/receive-order-list-container.jsx';
import { ReceiveOrderList } from '@/features/receive-order/components/receive-order-list.jsx';
import { ReceiveOrderSearch } from '@/features/receive-order/components/receive-order-search.jsx';

export const ReceiveOrder = () => {
  return (
    <div className='flex flex-col gap-3'>
      <ReceiveOrderListContainer>
        <ReceiveOrderSearch />
        <ReceiveOrderList />
      </ReceiveOrderListContainer>
    </div>
  );
};
