// @ts-check

import { api } from "@/services/api.js";

/**
 * @param {VendorSearch} params
 * @returns {Promise<VendorListResponse>}
 */
export const fetchVendors = async (params) => {
  return await api.get('vendor', { searchParams: params }).json();
};

export const createVendor = async (data) => {
  return await api.post('vendor', { json: data }).json();
};
