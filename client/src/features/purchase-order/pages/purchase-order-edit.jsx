import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';
import { useNavigate, useParams } from 'react-router-dom';

import { PurchaseOrderForm } from '@/features/purchase-order/components/purchase-order-form.jsx';
import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders.js';

export const PurchaseOrderEdit = () => {
  const { id } = useParams(); //  purchaseOrders의 id
  const navigate = useNavigate();
  const { rows, update } = usePurchaseOrders();

  const target = rows.find((r) => String(r.id) === String(id));

  if (!target) {
    return (
      <div className='w-full flex flex-col'>
        <AppHeader title='발주서 수정' description='존재하지 않는 발주서입니다' />
      </div>
    );
  }

  const initialValue = {
    orderNumber: target.orderNumber, // 읽기 전용
    orderDate: target.orderDate,     // 읽기 전용
    recieveDate: target.recieveDate ?? '',
    sellerVendorId: target.sellerVendorId ?? null,
    venderItemId: target.venderItemId ?? null,
    productId: target.productId ?? null,
    count: String(target.count ?? ''),
  };

  const handleSubmit = (payload) => {
    update(target.id, {
      recieveDate: payload.recieveDate,
      count: Number(payload.count || 0),
      sellerVendorId: payload.sellerVendorId,
      venderItemId: payload.venderItemId,
      productId: payload.productId,
    });
    navigate('..');
  };

  return (
    <div className='w-full flex flex-col'>
      <AppHeader title='발주서 수정' description='발주서를 수정합니다' />
      <div className='mt-6'>
        <Card className='p-6'>
          <PurchaseOrderForm mode='edit' initialValue={initialValue} onSubmit={handleSubmit} />
        </Card>
      </div>
    </div>
  );
};
