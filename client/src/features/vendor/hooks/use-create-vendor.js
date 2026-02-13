// @ts-check

/**
 * Api
 */
import { createVendor } from '@/features/vendor/api/index.js';

/**
 * Hooks
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createVendor(data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['vendors'], exact: false });
    },
  });
}
