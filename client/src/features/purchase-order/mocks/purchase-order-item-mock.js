// purchase-order-item-mock.js
// purchase_order_item 컬럼(예시)
// id, purchase_order_id, vender_item_id, product_id, count, status

export const purchaseOrderItems = [
  //  발주서 id=1 : 3개 품목
  { id: 1, purchaseOrderId: 1, venderItemId: 1001, productId: 201, count: 50 },
  { id: 2, purchaseOrderId: 1, venderItemId: 1002, productId: 202, count: 40 },
  { id: 3, purchaseOrderId: 1, venderItemId: 1003, productId: 203, count: 30 },

  //  발주서 id=2 : 2개 품목
  { id: 4, purchaseOrderId: 2, venderItemId: 1004, productId: 204, count: 20 },
  { id: 5, purchaseOrderId: 2, venderItemId: 1005, productId: 205, count: 60 },

  //  발주서 id=3 : 1개 품목 
  { id: 6, purchaseOrderId: 3, venderItemId: 1006, productId: 206, count: 200 },

  //  발주서 id=4 : 3개 품목
  { id: 7, purchaseOrderId: 4, venderItemId: 1007, productId: 207, count: 10 },
  { id: 8, purchaseOrderId: 4, venderItemId: 1001, productId: 201, count: 30 },
  { id: 9, purchaseOrderId: 4, venderItemId: 1002, productId: 202, count: 20 },

  //  발주서 id=5 : 2개 품목
  { id: 10, purchaseOrderId: 5, venderItemId: 1003, productId: 203, count: 25 },
  { id: 11, purchaseOrderId: 5, venderItemId: 1004, productId: 204, count: 15 },
];