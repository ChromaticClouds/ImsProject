import { AppHeader } from '@/components/common/app-header.jsx';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';
import { ProductCount } from '@/features/main/components/product-count.jsx';
import { StockShareRate } from '@/features/main/components/stock-share-rate.jsx';

export const Main = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className='flex flex-col w-full'>
      <AppHeader
        title='IMS PROJECT'
        description={`만나서 반가워요 ${user.name}님`}
      />
      <div className='grid grid-cols-10 gap-4'>
        <ProductCount />
        <StockShareRate />
      </div>
    </div>
  );
};
