import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { Badge } from '@/components/ui/badge';

const DetailRow = ({ label, value }) => (
  <>
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </>
);

export const ProductDetailDialog = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        {/* 헤더 */}
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {product.name}
            <Badge variant="secondary">{product.category}</Badge>
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            품목 코드 · {product.code}
          </DialogDescription>
        </DialogHeader>

        {/* 이미지 영역 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">박스 이미지</span>
            <img
              src={product.boximage}
              alt="box"
              className="h-40 w-full object-contain rounded border bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">낱개 이미지</span>
            <img
              src={product.singleimage}
              alt="single"
              className="h-40 w-full object-contain rounded border bg-white"
            />
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <DetailRow label="브랜드" value={product.brand} />
          <DetailRow label="박스당 낱개 수" value={`${product.boxQuantity}개입`} />
          <DetailRow label="단가" value={`${product.sale_price.toLocaleString()}원`} />
          <DetailRow label="등록일" value={product.regDate} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
