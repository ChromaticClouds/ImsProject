import { Card } from '@/components/ui/card.js';
import { OrderPostAction } from '@/features/receive-order/components/receive-order-post/order-post-action.jsx';
import { OrderPostHeader } from '@/features/receive-order/components/receive-order-post/order-post-header.jsx';
import { OrderPostList } from '@/features/receive-order/components/receive-order-post/order-post-list.jsx';
import { OrderPostSearch } from '@/features/receive-order/components/receive-order-post/order-post-search.jsx';
import { ReceiveOrderPostContainer } from '@/features/receive-order/components/receive-order-post/receive-order-post-container.jsx';
import { ReceiveOrderPostProvider } from '@/features/receive-order/providers/receive-order-post-provider.jsx';

export const ReceiveOrderPost = () => {
  return (
    <ReceiveOrderPostProvider>
      <ReceiveOrderPostContainer>
        <OrderPostHeader />
        <Card>
          <OrderPostList />
          <OrderPostSearch />
        </Card>
        <OrderPostAction />
      </ReceiveOrderPostContainer>
    </ReceiveOrderPostProvider>
  );
};
