// @ts-check
import { useQuery } from '@tanstack/react-query';
import { fetchOutboundAssignees } from '@/services/api.js';

export function useOutboundAssignees() {
  return useQuery({
    queryKey: ['outbound-assignees'],
    queryFn: fetchOutboundAssignees,
    staleTime: 5 * 60 * 1000,
  });
}
