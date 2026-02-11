// @ts-check

import React from 'react';

/**
 * Components
 */
import { Card } from '@/components/ui/card.js';
import { AppHeader } from '@/components/common/app-header.jsx';

export const ReceiveOrderListContainer = ({ children }) => {
  return (
    <React.Fragment>
      <AppHeader
        title='수주 내역'
        description='판매처로부터 수주한 주문 내역을 확인하세요'
      />
      <Card>{children}</Card>
    </React.Fragment>
  );
};
