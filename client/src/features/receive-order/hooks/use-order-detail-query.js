import { useQuery } from "@tanstack/react-query"
import { getItemsByOrderNumber } from "../api/index.js";

/**
 * @param {string} orderNumber
 * @param {boolean} open
 */
export const useOrderDetailQuery = (orderNumber, open) => {
  return useQuery({
    queryKey: ['order', 'detail', orderNumber],
    queryFn: () => getItemsByOrderNumber(orderNumber),
    enabled: open
  });
}