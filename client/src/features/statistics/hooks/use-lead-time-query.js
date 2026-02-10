import { useQuery } from "@tanstack/react-query";
import { getLeadTimeStats } from "../api/index.js";

export const useLeadTimeQuery = () => 
  useQuery({
    queryKey: ['stats', 'lead-time'],
    queryFn: async () => {
      const res = await getLeadTimeStats();
      return res?.data ?? [];
    }
  })