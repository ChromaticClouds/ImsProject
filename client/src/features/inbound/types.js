// @ts-check

/**
 * @typedef {object} InboundPendingSearch
 * @property {string} from
 * @property {string} to
 * @property {string=} keyword
 * @property {number} page
 * @property {number} size
 */

/**
 * @typedef {object} InboundPendingRow
 * @property {string} orderNumber
 * @property {string=} statusText
 * @property {string} receiveDate
 * @property {string} vendorName
 * @property {number} itemCount
 * @property {number} totalAmount
 * @property {number=} orderId  
 */

/**
 * @typedef {object} PageInfo
 * @property {number} number
 * @property {number} size
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {object} InboundPendingSummaryResponse
 * @property {InboundPendingRow[]} content
 * @property {PageInfo} page
 */

/**
 * @typedef {object} InboundPendingItem
 * @property {number} orderId
 * @property {string} productName
 * @property {string=} type
 * @property {string=} brand
 * @property {number=} orderQty
 * @property {number=} purchasePrice
 * @property {number=} lineAmount
 * @property {string=} imageUrl
 * @property {number=} salePrice
 */

/**
 * @property {string=} imageUrl
 * @property {number=} salePrice
 */

/**
 * @typedef {{ [orderNumber: string]: InboundPendingItem[] }} ItemsMap
 */
export {};
