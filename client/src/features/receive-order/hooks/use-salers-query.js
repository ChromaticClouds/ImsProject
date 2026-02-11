import { useQuery } from "@tanstack/react-query"
import { getSalers } from "../api/index.js";

export const useSalersQuery = () => {
  return useQuery({
    queryKey: ['salers'],
    queryFn: async () => {
      const response = await getSalers();
      return response?.data;
    }
  });
}