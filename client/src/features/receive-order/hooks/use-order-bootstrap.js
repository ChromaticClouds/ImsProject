import { getOrderBoostrap } from '@/features/receive-order/api/index.js';
import { useQuery } from '@tanstack/react-query';

export const useOrderBootstrap = () => {
  return useQuery({
    queryKey: ['receive-order-bootstrap'],
    queryFn: getOrderBoostrap,
    staleTime: 0,
    refetchOnMount: true,
  });
};
