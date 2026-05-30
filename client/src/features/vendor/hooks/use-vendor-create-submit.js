import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateVendor } from '@/features/vendor/hooks/use-create-vendor';

function toPayload(form, selectedItems) {
  return {
    type: form.type,
    vendorName: form.vendorName.trim(),
    telephone: form.telephone.trim(),
    email: form.email.trim(),
    bossName: form.bossName.trim(),
    address: form.address.trim(),
    memo: form.memo.trim() || null,
    items:
      form.type === 'Supplier'
        ? selectedItems.map((item) => ({
            productId: item.itemId,
            purchasePrice: item.unitPrice,
          }))
        : [],
  };
}

export function useVendorCreateSubmit({
  form,
  selectedItems,
  isValidRequired,
  isValidItemsForSupplier,
  touchRequired,
}) {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useCreateVendor();

  const onSubmit = async (e) => {
    e.preventDefault();
    touchRequired();

    if (!isValidRequired) {
      toast.error('필수 입력값을 확인해 주세요.');
      return;
    }

    if (!isValidItemsForSupplier) {
      toast.error('공급처는 품목 1개 이상과 모든 품목의 단가가 필요합니다.');
      return;
    }

    try {
      await mutateAsync(toPayload(form, selectedItems));
      toast.success('거래처가 등록되었습니다.');
      navigate('/dashboard/vendor');
    } catch (err) {
      toast.error(err?.message ?? '등록 중 오류가 발생했습니다.');
    }
  };

  return {
    onSubmit,
    isPending,
    error,
  };
}
