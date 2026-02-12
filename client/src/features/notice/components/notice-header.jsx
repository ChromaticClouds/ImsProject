/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Assets
 */
import { PlusIcon } from 'lucide-react';
import { BellIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useNavigate } from 'react-router-dom';

export const NoticeHeader = () => {
  const navigate = useNavigate();

  return (
    <CardHeader className='flex flex-row items-center justify-between'>
      <div>
        <CardTitle className='flex items-center gap-2'>
          <BellIcon className='w-5 h-5 text-primary' />
          공지사항
        </CardTitle>
        <CardDescription>
          시스템 운영 및 재고관리 관련 공지사항을 확인하세요.
        </CardDescription>
      </div>

      {/* 관리자만 작성 버튼 노출 */}
      <Button
        size='sm'
        className='gap-2'
        onClick={() => navigate('/dashboard/notice/create')}
      >
        <PlusIcon className='w-4 h-4' />
        작성
      </Button>
    </CardHeader>
  );
};
