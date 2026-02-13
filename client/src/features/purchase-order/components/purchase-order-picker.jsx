import { Button } from '@/components/ui/button.js';
import { useNavigate } from 'react-router-dom';
import { usePurchaseOrderFilterStore } from '@/features/purchase-order/stores/use-purchase-order-filter-store.js';
import { ClockIcon, CheckCircleIcon, NotebookPenIcon } from 'lucide-react';


export const PurchaseOrderPicker = () => {
  const navigate = useNavigate();
  const { view, setView } = usePurchaseOrderFilterStore();

  return (
    <section className='flex flex-col gap-4 mt-4'>
      <div className='flex items-center justify-between'>
        <div className='inline-flex rounded-lg border bg-muted p-1'>
          <Button
            variant={view === 'DRAFT' ? 'default' : 'secondary'}
            onClick={() => setView('DRAFT')}
            className='gap-2'
          >
            <ClockIcon className='w-4 h-4' />
            전송 전 내역
          </Button>

          <Button
            variant={view === 'SENT' ? 'default' : 'secondary'}
            onClick={() => setView('SENT')}
            className='gap-2'
          >
            <CheckCircleIcon className='w-4 h-4' />
            전송 완료 내역
          </Button>
        </div>
        <Button className='gap-2' onClick={() => navigate('create')} >
          <NotebookPenIcon className='w-5 h-5' />
          발주서 작성
        </Button>
      </div>
      
    </section>
  );
};
