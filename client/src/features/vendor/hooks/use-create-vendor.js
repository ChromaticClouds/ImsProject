// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVendor } from '../api/index';

export function useCreateVendor() {
  const qc = useQueryClient();

  return useMutation({
    /** @param {Record<string, unknown>} data */
    mutationFn: (data) => createVendor(data),
    onSuccess: async () => {
      
      await qc.invalidateQueries({ queryKey: ['vendors'], exact: false});
    },
  });
}


