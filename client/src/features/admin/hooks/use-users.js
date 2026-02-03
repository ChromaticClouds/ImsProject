import { useQuery } from "@tanstack/react-query"
import { fetchUsers } from "../api/index.js";

/** 
 * @param {number} page 
 */
export const useUsers = (page) => {
  return useQuery({
    queryKey: ['user', page],
    queryFn: () => fetchUsers(page)
  });
}