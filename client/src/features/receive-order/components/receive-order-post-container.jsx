// @ts-check

import { AppHeader } from '@/components/common/app-header.jsx';
import { OrderPostHeader } from '@/features/receive-order/components/order-post-header.jsx';
import React from 'react';

export const ReceiveOrderPostContainer = () => {
  return (
    <React.Fragment>
      <AppHeader
        title='발주서 작성'
        description='발주서 작성 페이지입니다'
      />
      <OrderPostHeader />
    </React.Fragment>
  );
};
