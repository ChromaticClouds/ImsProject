// @ts-check
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';

import { PurchaseOrderForm } from '@/features/purchase-order/components/purchase-order-form.jsx';
import { fetchPurchaseOrder, updatePurchaseOrder } from '@/features/purchase-order/api/index.js';


export const PurchaseOrderEdit = () => {
  const navigate = useNavigate();
  const { orderNumber } = useParams();

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        if (!orderNumber) return;

        const data = await fetchPurchaseOrder(orderNumber);
        if (!alive) return;
        setDetail(data ?? null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [orderNumber]);

  const initialValue = useMemo(() => {
    if (!detail) return null;

    return {
      orderNumber: detail.orderNumber,
      orderDate: detail.orderDate,
      recieveDate: detail.recieveDate ?? '',
      vendorName: detail.vendorName ?? '',
      items: Array.isArray(detail.items)
        ? detail.items.map((it) => ({
            orderId: Number(it.orderId),
            productName: it.productName ?? '',
            type: it.type ?? '',
            brand: it.brand ?? '',
            safetyStock: Number(it.safetyStock ?? 0),
            count: Number(it.count ?? 0),
            purchasePrice: Number(it.purchasePrice ?? 0),
          }))
        : [],
    };
  }, [detail]);

  if (!orderNumber) {
    return (
      <div className='w-full flex flex-col'>
        <AppHeader title='발주서 수정' description='잘못된 접근입니다' />
      </div>
    );
  }

  if (loading) {
    return (
      <div className='w-full flex flex-col'>
        <AppHeader title='발주서 수정' description='불러오는 중...' />
      </div>
    );
  }

  if (!initialValue) {
    return (
      <div className='w-full flex flex-col'>
        <AppHeader title='발주서 수정' description='존재하지 않는 발주서입니다' />
      </div>
    );
  }

  const handleSubmit = async (payload) => {
    await updatePurchaseOrder(orderNumber, payload);
    navigate('..'); // 목록으로
  };

  return (
    <div className='w-full flex flex-col'>
      <AppHeader title='발주서 수정' description='납기일/수량을 수정합니다' />

      <div className='mt-6'>
        <Card className='p-6'>
          <PurchaseOrderForm initialValue={initialValue} onSubmit={handleSubmit} />
        </Card>
      </div>
    </div>
  );
};
