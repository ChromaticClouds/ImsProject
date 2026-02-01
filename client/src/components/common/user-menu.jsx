/**
 * Components
 */
import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';
import { Card } from '@/components/ui/card.js';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover.js';

/**
 * Hooks
 */
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/stores/use-auth-store.js';

/**
 * Constants
 */
import { RANK_LABEL, ROLE_LABEL } from '@/constants/index.js';

/**
 * Assets
 */
import { LogOutIcon, LockIcon, ChevronUpIcon } from 'lucide-react';

export const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger className='text-inherit'>
        <Card className='px-3 py-2 cursor-pointer'>
          <div className='w-full flex justify-between items-center'>
            <div className='flex flex-col text-left'>
              <span className='text-xs text-muted-foreground'>
                {user.email}
              </span>

              <span className='text-sm font-medium'>
                {user.name}
                <span className='ml-1 text-xs text-muted-foreground'>
                  · {user.eid}
                </span>
              </span>
            </div>
            <ChevronUpIcon
              size={16}
              className={`
                transition-transform duration-200
                ${open ? 'rotate-180' : 'rotate-0'}
              `}
            />
          </div>
        </Card>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={10}
        className='w-60 rounded-xl p-0'
      >
        {/* 유저 정보 */}
        <div className='space-y-1 p-4'>
          <div className='text-sm font-medium'>{user.name}</div>

          <div className='text-xs text-muted-foreground'>
            {user.eid} · {user.email}
          </div>

          {/* 권한 배지 */}
          <div className='flex flex-wrap gap-1 pt-2'>
            <Badge variant='secondary'>{RANK_LABEL[user.rank]}</Badge>

            <Badge variant='secondary'>{ROLE_LABEL[user.role]}</Badge>
          </div>
        </div>

        {/* 구분선 */}
        <div className='h-px bg-border mx-2' />

        {/* 액션 */}
        <div className='flex flex-col gap-2 p-2'>
          <Button
            variant='ghost'
            size='sm'
            className='justify-start'
          >
            <LockIcon />
            <span>비밀번호 변경</span>
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='justify-start text-destructive'
          >
            <LogOutIcon />
            <span>로그아웃</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
