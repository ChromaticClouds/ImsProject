import { api } from "@/services/api.js";

/**
 * @typedef {{
 *   usedVolume: number
 *   totalVolume: number
 * }} WarehouseShareResponse
 */

/**
 * @returns {Promise<ApiResponse<WarehouseShareResponse>>}
 */
export const getWarehouseShare = () =>
  api.get('stats/by-warehouse').json();

/**
 * @typedef {{
 *   item: string
 *   stock: number
 *   volume: number
 * }} ProductShareResponse
 */

/**
 * @returns {Promise<ApiResponse<ProductShareResponse[]>>}
 */
export const getProductShare = () =>
  api.get('stats/by-product').json();

export const getLeadTimeStats = () =>
  api.get('stats/lead-time').json();
