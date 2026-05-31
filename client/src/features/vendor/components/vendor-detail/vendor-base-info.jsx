// @ts-check

import {
  Building2Icon,
  UserRound,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
} from 'lucide-react';

/**
 * 기본 정보 행 (아이콘 박스 + 라벨 + 값)
 * @param {{ icon: React.ElementType; label: string; value?: string }} props
 */
const InfoRow = ({ icon: Icon, label, value }) => {
  return (
    <div className='flex items-start gap-3 border-b py-2.5 last:border-b-0'>
      <div className='flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60 mt-0.5'>
        <Icon
          className='size-3.5 text-muted-foreground'
          aria-hidden='true'
        />
      </div>
      <div className='min-w-0'>
        <p className='text-xs text-muted-foreground'>{label}</p>
        <p className='mt-0.5 text-sm font-medium break-all'>{value || '—'}</p>
      </div>
    </div>
  );
};

/**
 * @param {{ vendor: VendorDetail }} props
 */
export const VendorBaseInfo = ({ vendor }) => {
  return (
    <div className='rounded-lg border bg-card'>
      <div className='flex items-center justify-between border-b px-5 py-4'>
        <div>
          <h2 className='text-sm font-medium'>기본 정보</h2>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            담당자 · 연락처 · 주소
          </p>
        </div>
        <Building2Icon
          className='size-4 text-muted-foreground'
          aria-hidden='true'
        />
      </div>
      <div className='px-5 py-3'>
        <InfoRow
          icon={Building2Icon}
          label='거래처명'
          value={vendor.vendorName}
        />
        <InfoRow
          icon={UserRound}
          label='대표자명'
          value={vendor.bossName}
        />
        <InfoRow
          icon={PhoneIcon}
          label='전화번호'
          value={vendor.telephone}
        />
        <InfoRow
          icon={MailIcon}
          label='이메일'
          value={vendor.email}
        />
        <InfoRow
          icon={MapPinIcon}
          label='주소'
          value={vendor.address}
        />
      </div>
    </div>
  );
};
