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

