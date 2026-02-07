import { AppHeader } from '@/components/common/app-header.jsx';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';
import { InventoryShare } from '@/features/main/inventory-share.jsx';
import { ProductCount } from '@/features/main/product-count.jsx';

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
    </div>
  );
};
