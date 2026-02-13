// @ts-check

/**
 * Components
 */
import { Button } from '@/components/ui/button.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.js';
import { FieldSet } from '@/components/ui/field.js';
import { ChevronDownIcon } from 'lucide-react';

/**
 * Hooks
 */
import { usePoContext } from '../../providers/purchase-order-post-provider.jsx';
import { usePoFormContext } from '../../providers/po-post-form-provder.jsx';

export const PurchaseOrderPostSelect = () => {
  const form = usePoFormContext();

  const { vendors, selectedVendorId, setSelectedVendorId } = usePoContext();

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId);

  return (
    <form.Field name='supplierId'>
      {(field) => (
        <FieldSet className='w-full'>
          <p className='text-xl font-semibold tracking-tight'>공급처 지정</p>
          <div className='items-center grid grid-cols-[100px_1fr]'>
            <span>공급처 선택</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className='w-60 flex justify-between'
                  variant='outline'
                >
                  <span
                    className={
                      !selectedVendor?.id ? 'text-muted-foreground' : ''
                    }
                  >
                    {selectedVendor?.name ?? '선택해주세요'}
                  </span>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-60'>
                <form.Field name='products'>
                  {(productField) => (
                    <DropdownMenuGroup>
                      {vendors.map((v) => (
                        <DropdownMenuItem
                          key={v.id}
                          onClick={() => {
                            setSelectedVendorId(v.id);
                            field.handleChange(v.id);
                            productField.handleChange(() => []);
                          }}
                        >
                          {v.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  )}
                </form.Field>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </FieldSet>
      )}
    </form.Field>
  );
};
