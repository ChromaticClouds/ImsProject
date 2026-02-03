import { api, hooks } from "@/services/api.js";

/** @returns {Promise<ApiResponse<PageResponse<User>>>} */
export const fetchUsers = () => api.get('user/list', { hooks }).json();