// @ts-check
import { useNavigate, useParams } from 'react-router-dom';
import { useVendorDetail } from '@/features/vendor/hooks/use-vendor-detail';
import { VendorDetailPage } from '@/features/vendor/components/vendor-detail-page';

export function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useVendorDetail(id);

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div style={{ color: 'crimson' }}>에러: {String(error?.message ?? error)}</div>;
  if (!data) return <div>데이터 없음</div>;

  return (
    <VendorDetailPage
      vendor={data.vendor}
      items={data.items ?? []}
      onBack={() => navigate('/dashboard/vendor')}
    />
  );
}
