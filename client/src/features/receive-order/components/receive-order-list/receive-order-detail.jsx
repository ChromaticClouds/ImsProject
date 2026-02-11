// @ts-check

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { TableCell } from '@/components/ui/table.js';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { useOrderDetailQuery } from '../../hooks/use-order-detail-query.js';
import { Spinner } from '@/components/ui/spinner.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.js';
import { Badge } from '@/components/ui/badge.js';

/**
 * @param {{ order: ReceiveOrder }} props
 */
export const ReceiveOrderDetail = ({ order }) => {
  const [open, setOpen] = useState(false);

  const {
    data,
    isPending, // 최초 fetch
    isFetching, // refetch 포함
  } = useOrderDetailQuery(order.orderNumber, open);

  const items = data?.data ?? [];
  const hasData = items.length > 0;

  return (
    <TableCell>
      <HoverCard
        open={open}
        onOpenChange={setOpen}
      >
        <HoverCardTrigger asChild>
          <Badge
            variant='secondary'
            className='cursor-pointer w-10 h-10 rounded-lg text-sm'
          >
            {order.itemCount}
          </Badge>
        </HoverCardTrigger>

        <HoverCardContent
          align='start'
          className='w-96 p-0 shadow-xl border rounded-2xl'
        >
          {/* Header */}
          <div className='px-4 py-3 border-b bg-muted/40 text-sm font-semibold'>
            주문 상세 ({items.length})
          </div>

          {/* Body */}
          <ScrollArea className='max-h-80 overflow-y-auto'>
            <div className='p-3 space-y-2'>
              {isPending && !hasData && (
                <div className='h-32 flex items-center justify-center'>
                  <Spinner />
                </div>
              )}

              {!isPending && !hasData && (
                <div className='text-sm text-muted-foreground text-center py-6'>
                  항목이 없습니다.
                </div>
              )}

              {hasData && (
                <>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className='flex gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors'
                    >
                      <div className='w-14 h-14'>
                        <Avatar className='w-14 h-14 rounded-lg'>
                          <AvatarImage
                            src={item.imageUrl}
                            alt={item.name}
                            className='object-cover'
                          />
                          <AvatarFallback className='rounded-lg text-xs'>
                            {item.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-medium truncate'>
                          {item.name}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {item.brand}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {item.itemType}
                        </div>
                      </div>

                      <div className='flex items-center'>
                        <span className='text-sm font-semibold'>
                          x{item.count}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* 4️⃣ 조용한 백그라운드 리패치 표시 (선택) */}
                  {isFetching && (
                    <div className='text-[10px] text-muted-foreground text-center pt-1'>
                      업데이트 중...
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </HoverCardContent>
      </HoverCard>
    </TableCell>
  );
};
