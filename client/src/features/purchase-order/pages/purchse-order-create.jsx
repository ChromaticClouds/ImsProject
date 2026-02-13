import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';
import { useNavigate } from 'react-router-dom';

import { PurchaseOrderForm } from '@/features/purchase-order/components/purchase-order-form.jsx';
import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders.js';

/**
 * 작성 페이지
 * - 발주번호 자동 생성(읽기 전용)
 * - 발주일 기본값: 오늘
 */
export const PurchaseOrderCreate = () => {
  const navigate = useNavigate();
  const { rows, setRows } = usePurchaseOrders();

  // 발주번호 자동 생성(간단 규칙)
  const createOrderNumber = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');

    // 같은 YYYYMM의 max sequence 찾기
    const prefix = `PO-${yyyy}${mm}-`;
    const maxSeq = rows
      .map((r) => r.orderNumber)
      .filter((n) => typeof n === 'string' && n.startsWith(prefix))
      .map((n) => Number(n.replace(prefix, '')))
      .filter((n) => Number.isFinite(n))
      .reduce((a, b) => Math.max(a, b), 0);

    const nextSeq = String(maxSeq + 1).padStart(3, '0');
    return `${prefix}${nextSeq}`;
  };

  const toISO = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const initialValue = {
    orderNumber: createOrderNumber(),
    orderDate: toISO(new Date()),
    recieveDate: '', // 납기일(선택)
    sellerVendorId: null,
    venderItemId: null,
    productId: null,
    count: '',
  };

  const handleSubmit = (payload) => {
   
    const nextId = rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;

    setRows([
      ...rows,
      {
        id: nextId,
        userId: 1,
        orderNumber: payload.orderNumber,
        orderDate: payload.orderDate,
        recieveDate: payload.recieveDate,
        count: Number(payload.count || 0),
        leadTime: null,
        status: null, // 작성=전송 전
        venderItemId: payload.venderItemId,
        productId: payload.productId,
        sellerVendorId: payload.sellerVendorId,
      },
    ]);

    navigate('..'); // 목록으로
  };

  return (
    <div className='w-full flex flex-col'>
      <AppHeader title='발주서 작성' description='공급처/품목을 선택해 발주서를 작성합니다' />
      <div className='mt-6'>
        <Card className='p-6'>
          <PurchaseOrderForm mode='create' initialValue={initialValue} onSubmit={handleSubmit} />
        </Card>
      </div>
    </div>
  );
};
