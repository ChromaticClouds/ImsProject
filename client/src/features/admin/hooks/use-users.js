import { useQuery } from "@tanstack/react-query"
import { fetchUsers } from "../api/index.js";

export const useUsers = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUsers
  });
}