/**
 * @typedef {Pick<OrderDetail, 'productId' | 'productName' | 'brand' | 'type'> & { purchasePrice: number, imageUrl?: string }} VendorProductType
 */

/**
 * @typedef {object} VendorDetailResponse
 * @property {VendorDetail} vendor
 * @property {(VendorProductType)[]} items
 */

export {};
