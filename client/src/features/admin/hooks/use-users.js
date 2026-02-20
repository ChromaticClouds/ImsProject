import { useQuery } from "@tanstack/react-query"
import { fetchUsers } from "../api/index.js";

/** 
 * @param {number} page 
 */
export const useUsers = (page, keyword) => {
  return useQuery({
    queryKey: ['users', page, keyword],
    queryFn: () => fetchUsers(page, keyword),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}