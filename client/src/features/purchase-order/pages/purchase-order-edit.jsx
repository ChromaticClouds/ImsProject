// @ts-check
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';

import { PurchaseOrderForm } from '@/features/purchase-order/components/purchase-order/purchase-order-form.jsx';
import {
  fetchPurchaseOrder,
  updatePurchaseOrder,
} from '@/features/purchase-order/api/index.js';
import { toast } from 'sonner';

export const PurchaseOrderEdit = () => {
  const navigate = useNavigate();
  const { orderNumber } = useParams();
  const queryClient = useQueryClient();

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

  const handleSubmit = async (payload) => {
    try {
      await updatePurchaseOrder(orderNumber, payload);

      // TODO: 여기 predicate는 임시. 목록 queryKey를 알면 그걸로 정확히 invalidate 하는게 베스트.
      queryClient.invalidateQueries({
        predicate: (q) => {
          const key = q.queryKey;
          return Array.isArray(key) && key.some((k) => String(k).includes('purchase'));
        },
      });

      toast.success('발주서가 수정되었습니다');
      navigate('..', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error('발주서 수정에 실패했습니다');
    }
  };

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