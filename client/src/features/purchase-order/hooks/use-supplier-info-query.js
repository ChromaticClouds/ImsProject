import { useQuery } from "@tanstack/react-query"
import { fetchSupplier } from "../api/index.js";

/**
 * 선택한 id에 따라 공급처 정보를 가져오는 Query 훅
 * @param {number} id
 */
export const useSupplierInfoQuery = (id) => {
  return useQuery({
    queryKey: ['supplier', 'info', id],
    queryFn: async () => {
      const response = await fetchSupplier(id);
      return response.vendor
    },
    enabled: !!id
  });
}