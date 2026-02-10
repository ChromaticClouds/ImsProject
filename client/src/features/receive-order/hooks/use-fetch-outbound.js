/**
 * Hooks
 */
import { useQuery } from '@tanstack/react-query';

/**
 * Api
 */
import { fetchOutboundManagers } from '../api/index.js';

export const useFetchOutbound = () => {
  return useQuery({
    queryKey: ['outbound-managers'],
    queryFn: fetchOutboundManagers,
  });
};
