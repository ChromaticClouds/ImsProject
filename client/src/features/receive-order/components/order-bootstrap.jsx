import { Input } from "@/components/ui/input.js";
import { useOrderPostContext } from "../providers/receive-order-post-provider.jsx";

export const OrderBootstrap = () => {
  // 수주 번호를 context에서 가져옴
  const { sequence } = useOrderPostContext();

  return (
    <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
      <div className='grid grid-cols-1 gap-1 md:grid-cols-[120px_1fr] md:items-center'>
        <span className='text-sm md:text-base'>수주 번호</span>
        <Input
          className='w-full md:w-60'
          value={sequence}
          disabled
        />
      </div>

      <div className='grid grid-cols-1 gap-1 md:grid-cols-[120px_1fr] md:items-center'>
        <span className='text-sm md:text-base'>수주 날짜</span>
        <Input
          className='w-full md:w-60'
          value={new Date().toLocaleDateString()}
          disabled
        />
      </div>
    </div>
  );
};
