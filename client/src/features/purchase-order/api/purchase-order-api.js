// src/features/purchase-order/api/purchase-order-api.js
import { purchaseOrders } from '@/features/purchase-order/mocks/purchase-order-mock.js';

/**
 * 지금은 mock을 그대로 반환
 * 나중에 Spring/JPA 붙으면 여기만 fetch로 교체하면 됨
 */
export const fetchPurchaseOrders = async () => {
  // mock은 동기지만 형태 통일하려고 Promise로 감싸서 반환
  return Promise.resolve(purchaseOrders);
};
