import { getOrderCategories } from "@/features/receive-order/api/index.js";
import { useQuery } from "@tanstack/react-query"

export const useOrderCategory = () => {
  return useQuery({
    queryKey: ['order-categories'],
    queryFn: getOrderCategories
  });
}