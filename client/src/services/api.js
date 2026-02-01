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

export const createVendor = async (data) => {
  return await api.post('vendor', { json: data }).json();
};