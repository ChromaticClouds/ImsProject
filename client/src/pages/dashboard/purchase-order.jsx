// @ts-check
import { useEffect, useMemo } from 'react';
import { AppHeader } from '@/components/common/app-header.jsx';
import { Card } from '@/components/ui/card.js';

import { PurchaseOrderFooter } from '@/features/purchase-order/components/purchase-order-footer.jsx';
import { PurchaseOrderHeader } from '@/features/purchase-order/components/purchase-order-header.jsx';
import { PurchaseOrderList } from '@/features/purchase-order/components/purchase-order-list.jsx';
import { PurchaseOrderPicker } from '@/features/purchase-order/components/purchase-order-picker.jsx';

import { usePurchaseOrders } from '@/features/purchase-order/hooks/use-purchase-orders.js';
import { usePurchaseOrderFilterStore } from '@/features/purchase-order/stores/use-purchase-order-filter-store.js';

export const PurchaseOrder = () => {
  const { rows, page, summary, load, summaryDraft, summarySent } = usePurchaseOrders();
  const { view, keyword, range } = usePurchaseOrderFilterStore();

  const totalQty = view === 'SENT'
  ? (summarySent?.totalCount ?? 0)
  : (summaryDraft?.totalCount ?? 0);

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

  const pagination = {
    currentPage: page?.number ?? 1,
    totalPages: page?.totalPages ?? 1,
    setCurrentPage: (p) => load({ ...params, page: p }),
  };
  

  return (
    <div className='w-full flex flex-col'>
      <AppHeader
        title='발주 관리'
        description='발주서 전송 전/전송 완료 내역을 확인하고 발주서를 전송/수정/삭제합니다'
      />

      <PurchaseOrderPicker />

      <div className='mt-6'>
        <Card>
          <PurchaseOrderHeader onReload={onReload} />
          <PurchaseOrderList rows={rows} onReload={onReload} />
          <PurchaseOrderFooter pagination={pagination} totalCount={page?.totalElements ?? 0} summary={summary} />
        </Card>
      </div>
    </div>
  );
};
