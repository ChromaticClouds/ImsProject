// @ts-check
import { useEffect, useMemo } from 'react';
import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';

import { PurchaseOrderFooter } from '@/features/purchase-order/components/purchase-order/purchase-order-footer.jsx';
import { PurchaseOrderHeader } from '@/features/purchase-order/components/purchase-order/purchase-order-header.jsx';
import { PurchaseOrderList } from '@/features/purchase-order/components/purchase-order/purchase-order-list.jsx';
import { PurchaseOrderPicker } from '@/features/purchase-order/components/purchase-order/purchase-order-picker.jsx';

import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders.js';
import { usePurchaseOrderFilterStore } from '@/features/purchase-order/stores/use-purchase-order-filter-store.js';
import { PoListProvider } from '@/features/purchase-order/providers/po-list-provider.jsx';

export const PurchaseOrder = () => {
  const { page, load } = usePurchaseOrders();
  const { view, keyword, range } = usePurchaseOrderFilterStore();

  const params = useMemo(() => {
    const from = range?.from ? String(range.from) : undefined;
    const to = range?.to ? String(range.to) : undefined;
    return {
      view,
      keyword: keyword || undefined,
      from,
      to,
      page: page?.number ?? 1,
      size: page?.size ?? 10,
    };
  }, [view, keyword, range, page?.number, page?.size]);

  useEffect(() => {
    load({ ...params, page: 1 });
  }, [view, keyword, range]);

  const onReload = async () => {
    await load(params);
  };

  return (
    <div className='w-full flex flex-col'>
      <AppHeader
        title='발주 관리'
        description='발주서 전송 전/전송 완료 내역을 확인하고 발주서를 전송/수정/삭제합니다'
      />

      <PurchaseOrderPicker />

      <PoListProvider>
        <div className='mt-6'>
          <Card>
            <PurchaseOrderHeader onReload={onReload} />
            <PurchaseOrderList />
            <PurchaseOrderFooter />
          </Card>
        </div>
      </PoListProvider>
    </div>
  );
};
