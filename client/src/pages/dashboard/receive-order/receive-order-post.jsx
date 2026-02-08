import { OrderPostHeader } from '@/features/receive-order/components/order-post-header.jsx';
import { ReceiveOrderPostContainer } from '@/features/receive-order/components/receive-order-post-container.jsx';
import { ReceiveOrderPostProvider } from '@/features/receive-order/providers/receive-order-post-provider.jsx';

export const ReceiveOrderPost = () => {
  return (
    <ReceiveOrderPostProvider>
      <ReceiveOrderPostContainer>
        <OrderPostHeader />
      </ReceiveOrderPostContainer>
    </ReceiveOrderPostProvider>
  );
};
