import { AppHeader } from '@/components/common/app-header.jsx';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';
import { InventoryShare } from '@/features/main/components/inventory-share.jsx';
import { ProductCount } from '@/features/main/components/product-count.jsx';

import { MainNotice } from '@/features/main/components/main-notice';
import { MainTodo } from '@/features/main/components/main-todo';

export const Main = () => {
  const { user } = useAuthStore();

  return (
    <div className='flex flex-col'>
      <AppHeader
        title='메인 페이지'
        description={`만나서 반가워요 ${user.name}님`}
      />
      <div className='grid grid-cols-10 gap-4'>
        <ProductCount />
        <InventoryShare />
      </div>

      {/* <div className='mt-4 grid grid-cols-10 gap-4'> */}
      <div className='mt-4 grid gap-4'>
        <MainNotice />
        {/* <MainTodo /> */}
      </div>
    </div>
  );
};
