// @ts-check
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteVendor } from '@/features/vendor/hooks/use-delete-vendor';

/**
 * @param {{ vendor: any, items: any[], onBack?: () => void }} props
 */
export function VendorDetailPage({ vendor, items, onBack }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const vendorId = Number(id);

  const { mutateAsync: deleteVendorMutate, isPending: deleting } = useDeleteVendor();

  const onDelete = async () => {
    if (!Number.isFinite(vendorId)) {
      alert('잘못된 거래처 ID입니다.');
      return;
    }

    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok) return;

    try {
      await deleteVendorMutate(vendorId);
      alert('삭제되었습니다.');
      navigate('/dashboard/vendor'); // 목록으로 이동
    } catch (error) {
      alert(`삭제 중 에러 발생: ${String(error?.message ?? error)}`);
    }
  };

  return (
    <div>
      <h1>거래처 상세</h1>

      <div>구분: {vendor.type === 'Supplier' ? '공급처' : '판매처'}</div>
      <div>거래처명: {vendor.vendorName}</div>
      <div>전화번호: {vendor.telephone ?? '-'}</div>
      <div>이메일: {vendor.email ?? '-'}</div>
      <div>주소: {vendor.address ?? '-'}</div>
      <div>메모: {vendor.memo ?? '-'}</div>

      {vendor.type === 'Supplier' ? (
        <div style={{ marginTop: 12 }}>
          <h2>거래 품목 및 구매 단가</h2>
          {items.length === 0 ? (
            <div>등록된 품목이 없습니다.</div>
          ) : (
            <ul>
              {items.map((it) => (
                <li key={it.productId}>
                  {it.productName} / {it.purchasePrice}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      <div style={{ marginTop: 12 }}>
        <Button onClick={() => navigate(`/dashboard/vendor/modify/${vendor.id}`)}>
          수정
        </Button>
        <br />
        <Button onClick={onDelete} disabled={deleting} variant="destructive">
          {deleting ? '삭제 중...' : '삭제'}
        </Button>
      </div>
    </div>
  );
}
