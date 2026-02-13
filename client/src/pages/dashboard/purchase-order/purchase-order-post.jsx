import { PurchaseOrderFieldGroup } from '@/features/purchase-order/components/purchase-order-post/purchase-order-field-group.jsx';
import { PurchaseOrderPostContainer } from '@/features/purchase-order/components/purchase-order-post/purchase-order-post-container.jsx';
import { PoPostFormProvider } from '@/features/purchase-order/providers/po-post-form-provder.jsx';
import { PurchaseOrderPostProvider } from '@/features/purchase-order/providers/purchase-order-post-provider.jsx';

export const PurchaseOrderPost = () => {
  return (
    <PoPostFormProvider>
      <PurchaseOrderPostProvider>
        <PurchaseOrderPostContainer>
          <PurchaseOrderFieldGroup />
        </PurchaseOrderPostContainer>
      </PurchaseOrderPostProvider>
    </PoPostFormProvider>
  );
};
