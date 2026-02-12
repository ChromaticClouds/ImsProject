import { FieldSeparator } from '@/components/ui/field.js';
import { PurchaseOrderAutofill } from './purchase-order-autofill.jsx';
import { PurchaseOrderPostSelect } from './purchase-order-post-select.jsx';
import { SupplierInfo } from './supplier-info.jsx';
import { ToPurchaseListContainer } from './to-purchase-list-container.jsx';
import { ToPurchaseProductList } from './to-purchase-product-list.jsx';
import { ToPurchaseListSearch } from './to-purchase-list-search.jsx';
import { PoPostAction } from './po-post-action.jsx';

export const PurchaseOrderFieldGroup = () => {
  return (
    <>
      <PurchaseOrderAutofill />
      <FieldSeparator />
      <PurchaseOrderPostSelect />
      <FieldSeparator />
      <SupplierInfo />
      <FieldSeparator />
      <ToPurchaseListContainer>
        <ToPurchaseProductList />
        <ToPurchaseListSearch />
      </ToPurchaseListContainer>
      <FieldSeparator />
      <PoPostAction />
    </>
  );
};
