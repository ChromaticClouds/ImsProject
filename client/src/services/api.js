import ky from "ky";

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_SERVER_URL,
  timeout: 30000,
  credentials: 'include',
  retry: 0
}); // 기본 API 클라이언트

/**
 * @param {VendorSearch} params
 * @returns {Promise<VendorListResponse>}
 */
export const fetchVendors = async (params = {}) => {
  return await api.get('vendor', { searchParams: params }).json();
};

export const fetchItems = async (params) => {
  // params: { keyword: string, excludeAssigned: boolean }
  const search = new URLSearchParams();
  if (params?.keyword) search.set('keyword', params.keyword);
  if (params?.excludeAssigned) search.set('excludeAssigned', 'true');

  return await api.get(`items?${search.toString()}`).json();
};

export const createVendor = async (data) => {
  return await api.post('vendor', { json: data }).json();
};

// product 검색
export const fetchProducts = async ({ keyword, excludeAssigned = true }) => {
  const qs = new URLSearchParams();
  if (keyword) qs.set('keyword', keyword);
  if (excludeAssigned) qs.set('excludeAssigned', 'true');
  return await api.get(`vendor/products?${qs.toString()}`).json();
};

// 거래처 등록 - vendor_item 저장
export const createVendorItems = async (items) => {
  // items: [{ vendor_id, product_id, purchase_price }, ...]
  return await api.post('vendor-items', { json: { items } }).json();
};

// 벌크가 없을시 단건 저장용
export const createVendorItem = async (data) => {
  // data: { vendor_id, product_id, purchase_price }
  return await api.post('vendor-item', { json: data }).json();
};

// 거래처 삭제(soft delete: status=DELETED)
export const deleteVendor = async (id) => {
  return await api.delete(`vendor/${id}`).json();
};

// 거래처 수정
export const updateVendor = async (id, data) => {
  return await api.put(`vendor/${id}`, { json: data }).json();
};

// inbound - pending summary
/**
 * @typedef {Object} InboundPendingSummaryParams
 * @property {string} from
 * @property {string} to
 * @property {string=} keyword
 * @property {number} page
 * @property {number} size
 */

/**
 * @param {InboundPendingSummaryParams} params
 * @returns {Promise<any>} // TODO: 실제 응답 타입으로 교체
 */
export const fetchInboundPendingSummary = async (params) => {
  return await api
    .get('api/inbounds/pending/summary', { searchParams: params })
    .json();
};

// inbound - pending items
/**
 * 발주번호로 품목 목록
 * @param {string} orderNumber
 * @returns {Promise<any>} // TODO: 실제 응답 타입으로 교체
 */
export const fetchInboundPendingItems = async (orderNumber) => {
  return await api
    .get(`api/inbounds/pending/${encodeURIComponent(orderNumber)}/items`)
    .json();
};

// inbound - complete order
/**
 * 입고 완료
 * @param {number} orderId
 * @returns {Promise<any>} // 응답이 없으면 void/{}로 바꿔도 됨
 */
export const completeInboundOrder = async (orderId) => {
  return await api
    .patch(`api/inbounds/orders/${encodeURIComponent(orderId)}/complete`)
    .json();
};

export const completeInboundByOrderNumber = async (orderNumber, body = {}) => {
  return await api
    .patch(`api/inbounds/orders/by-number/${encodeURIComponent(orderNumber)}/complete`, {
      json: body,
    })
    .json();
};