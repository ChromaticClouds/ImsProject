// @ts-check

/**
 * Components
 */
import { AppHeader } from '@/components/common/app-header.jsx';
import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';

/**
 * Assets
 */
import { StoreIcon, PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Constants
 */
import {
  VENDOR_DESCRIPTION,
  VENDOR_TYPE_MAP,
  VENDOR_TYPE_STYLES,
} from '@/features/vendor/constants/index.js';
import { AppDialog } from '@/components/common/app-dialog.jsx';

/**
 * @typedef {object} VendorDetailHeaderProps
 * @property {VendorDetail} vendor
 * @property {() => void} onEdit
 * @property {() => Promise<void>} onDelete
 * @property {boolean} isSubmitting
 */

/**
 * @param {VendorDetailHeaderProps} props
 */
export const VendorDetailHeader = ({
  vendor,
  onEdit,
  onDelete,
  isSubmitting,
}) => {
  const typeStyle = VENDOR_TYPE_STYLES[vendor.type];

  return (
    <AppHeader
      allowBackward
      title={
        <div className='flex flex-col gap-2'>
          <Badge className={typeStyle.icon}>
            <StoreIcon />
            <span>{VENDOR_TYPE_MAP[vendor.type]}</span>
          </Badge>
          <span>{vendor.vendorName}</span>
        </div>
      }
      description={VENDOR_DESCRIPTION[vendor.type]}
      asideDecoration={
        <div className='flex shrink-0 gap-2 items-end'>
          <Button
            variant='secondary'
            className='border'
            onClick={onEdit}
          >
            <PencilIcon />
            <span>수정</span>
          </Button>
          <AppDialog
            title='거래처 삭제'
            description='해당 거래처를 삭제하시겠습니까?'
            action={onDelete}
            actionMark={<span className='text-destructive'>삭제</span>}
            isSubmitting={isSubmitting}
            variant='secondary'
            navigateTo='/dashboard/vendor'
          >
            <Button
              variant='secondary'
              className='text-destructive border'
            >
              <TrashIcon />
              <span>삭제</span>
            </Button>
          </AppDialog>
        </div>
      }
    />
  );
};
