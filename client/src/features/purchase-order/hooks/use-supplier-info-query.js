import { useQuery } from "@tanstack/react-query"
import { fetchSupplier } from "../api/index.js";

/**
 * 선택한 id에 따라 공급처 정보를 가져오는 Query 훅
 * @param {number | null} id
 */
export const useSupplierInfoQuery = (id) => {
  return useQuery({
    queryKey: ['supplier', 'info', id],
    queryFn: async () => {
      if (id == null) throw new Error('Supplier id is required');
      const response = await fetchSupplier(id);
      return response.vendor
    },
    enabled: !!id
  });
}
