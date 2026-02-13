// @ts-check

import { AppHeader } from '@/components/common/app-header.jsx';
import { FieldGroup } from '@/components/ui/field.js';
import { usePoPostForm } from '../../hooks/use-po-post-form.js';

/**
 * @param {React.PropsWithChildren} props
 */
export const PurchaseOrderPostContainer = ({ children }) => {
  const form = usePoPostForm();

  return (
    <>
      <AppHeader
        title='발주서 작성'
        description='발주서 작성 페이지입니다.'
      />
      <form onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
        <FieldGroup className='w-full'>{children}</FieldGroup>
      </form>
    </>
  );
};
