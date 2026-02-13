// @ts-check
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteVendor } from '@/features/vendor/hooks/use-delete-vendor';
import { useVendorDetail } from '@/features/vendor/hooks/use-vendor-detail';

export function VendorDetailPage() {
  const navigate = useNavigate();

  const { id } = useParams();
  const vendorId = Number(id);

  const { data, isLoading, error } = useVendorDetail(vendorId);
  const { mutateAsync: deleteVendorMutate, isPending: deleting } =
    useDeleteVendor();

  const onDelete = async () => {
    if (!Number.isFinite(vendorId) || vendorId <= 0) {
      alert('잘못된 거래처 ID입니다.');
      return;
    }

    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok) return;

    try {
      await deleteVendorMutate(vendorId);
      alert('삭제되었습니다.');
      navigate('/dashboard/vendor');
    } catch (e) {
      alert(`삭제 중 에러 발생: ${String(e?.message ?? e)}`);
    }
  };

  if (!Number.isFinite(vendorId) || vendorId <= 0)
    return <div>잘못된 거래처 ID</div>;
  if (isLoading) return <div>불러오는 중...</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

  //
  const vendor = data.vendor ?? data?.data?.vendor ?? data; // 혹시 구조 다르면 방어
  const items = data.items ?? data?.data?.items ?? [];

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
        <Button
          onClick={() => navigate(`/dashboard/vendor/modify/${vendorId}`)}
        >
          수정
        </Button>
        <br />
        <Button
          onClick={onDelete}
          disabled={deleting}
          variant='destructive'
        >
          {deleting ? '삭제 중...' : '삭제'}
        </Button>
      </div>
    </div>
  );
}
