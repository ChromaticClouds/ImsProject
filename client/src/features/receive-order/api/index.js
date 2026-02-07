import { api, hooks } from "@/services/api.js";

/**
 * @returns {ApiResponse<{ users: string[], sellers: string[] }>}
 */
export const getOrderCategories = () =>
  api.get('order/categories', { hooks }).json();