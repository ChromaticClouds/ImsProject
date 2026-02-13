// @ts-check
import { api } from '@/services/api.js';

/**
 * @param {VendorSearch} params
 * @returns {Promise<VendorListResponse>}
 */
export const fetchVendors = async (params) => {
  return await api.get('vendor', { searchParams: params }).json();
};

export const createVendor = async (data) => {
  // data는 VendorCreateRequest 형태여야 함 (아래 2번 참고)
  return await api.post('vendor', { json: data }).json();
};

export const updateVendor = async (id, data) => {
  return await api.put(`vendor/${id}`, { json: data }).json();
};

export const deleteVendor = async (id) => {
  return await api.delete(`vendor/${id}`).json();
};

export const fetchProducts = async ({ keyword, excludeAssigned = true, currentVendorId }) => {
  const qs = new URLSearchParams();
  if (keyword) qs.set('keyword', keyword);
  if (excludeAssigned) qs.set('excludeAssigned', 'true');
  if (currentVendorId != null) qs.set('currentVendorId', String(currentVendorId));
  return await api.get(`vendor/products?${qs.toString()}`).json();
};

export const softDeleteVendorItem = async ({ vendorId, productId }) => {
  return await api.patch(`vendor/${vendorId}/items/${productId}`).json();
  
};

