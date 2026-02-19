
// @ts-check
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteVendor } from '@/features/vendor/hooks/use-delete-vendor';
import { useVendorDetail } from '@/features/vendor/hooks/use-vendor-detail';
import { Badge } from '@/components/ui/badge';

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
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground">
          잘못된 거래처 ID
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground">
          불러오는 중...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          {String(error?.message ?? error)}
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        <div className="rounded-2xl border bg-white p-6 text-sm text-muted-foreground">
          데이터가 없습니다.
        </div>
      </div>
    );

  //
  const vendor = data.vendor ?? data?.data?.vendor ?? data; // 혹시 구조 다르면 방어
  const items = data.items ?? data?.data?.items ?? [];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/40">
      <div className="mx-auto max-w-[1100px] px-5 py-6">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">거래처 상세</h1>
              <Badge variant="secondary">
                {vendor.type === 'Supplier' ? '공급처' : '판매처'}
              </Badge>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              거래처 기본 정보와(공급처인 경우) 거래 품목/단가를 확인합니다.
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={deleting}
            >
              뒤로
            </Button>

            <Button
              onClick={() => navigate(`/dashboard/vendor/modify/${vendorId}`)}
              disabled={deleting}
            >
              수정
            </Button>

            <Button
              onClick={onDelete}
              disabled={deleting}
              variant="destructive"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left: vendor info */}
          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-2xl border bg-white">
              <div className="border-b px-5 py-4">
                <div className="font-semibold">기본 정보</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  구분/연락처/주소 등 주요 정보를 확인합니다.
                </div>
              </div>

              <div className="p-5">
                <div className="grid gap-4">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 text-sm text-muted-foreground">구분</div>
                    <div className="col-span-8 text-sm font-medium">
                      {vendor.type === 'Supplier' ? '공급처' : '판매처'}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 text-sm text-muted-foreground">거래처명</div>
                    <div className="col-span-8 text-sm font-medium">
                      {vendor.vendorName ?? '-'}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 text-sm text-muted-foreground">전화번호</div>
                    <div className="col-span-8 text-sm font-medium tabular-nums">
                      {vendor.telephone ?? '-'}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 text-sm text-muted-foreground">이메일</div>
                    <div className="col-span-8 text-sm font-medium">
                      {vendor.email ?? '-'}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 text-sm text-muted-foreground">주소</div>
                    <div className="col-span-8 text-sm font-medium">
                      {vendor.address ?? '-'}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 text-sm text-muted-foreground">메모</div>
                    <div className="col-span-8">
                      <div className="whitespace-pre-wrap rounded-xl border bg-muted/30 px-3 py-2 text-sm">
                        {vendor.memo ?? '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: items */}
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-2xl border bg-white">
              <div className="border-b px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">거래 품목 및 구매 단가</div>
                  <Badge variant="secondary">
                    {vendor.type === 'Supplier' ? `${items.length}개` : '해당 없음'}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  공급처일 때만 표시됩니다.
                </div>
              </div>

              <div className="p-5">
                {vendor.type === 'Supplier' ? (
                  items.length === 0 ? (
                    <div className="rounded-xl border bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
                      등록된 품목이 없습니다.
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border">
                      <div className="grid grid-cols-12 bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
                        <div className="col-span-8">품목</div>
                        <div className="col-span-4 text-right">구매 단가</div>
                      </div>

                      <div className="divide-y">
                        {items.map((it) => (
                          <div
                            key={it.productId}
                            className="grid grid-cols-12 items-center px-4 py-3 hover:bg-muted/20"
                          >
                            <div className="col-span-8 min-w-0">
                              <div className="truncate text-sm font-medium">
                                {it.productName ?? '-'}
                              </div>
                              
                            </div>

                            <div className="col-span-4 text-right">
                              <div className="text-sm font-semibold tabular-nums">
                                {Number(it.purchasePrice ?? 0).toLocaleString()}
                              </div>
                              <div className="text-[11px] text-muted-foreground"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="rounded-xl border bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
                    판매처는 거래 품목/단가를 사용하지 않습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
