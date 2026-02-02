// @ts-check
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteVendor } from '@/services/api'

export function useDeleteVendor() {
  const queryClient = useQueryClient()

  return useMutation({
    /** @param {number} id */
    mutationFn: (id) => deleteVendor(id),

    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: ['vendors'], exact: false })
     
      queryClient.invalidateQueries({ queryKey: ['vendorDetail'], exact: false })
    },
  })
}


