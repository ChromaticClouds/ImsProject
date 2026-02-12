// @ts-check

import { api } from "@/services/api"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"

export const useSearchQuery = () => {
  const [params] = useSearchParams();

  const search = (params.get('search') ?? '').trim();

  return useQuery({
    queryKey: ['search', 'notice', search],
    queryFn: () => api.get(`api/notice/list?search=${search}`).json(),
  })
}