export const OrderPostSearchSkeleton = () => {
  return (
    <div className='p-2 space-y-2'>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className='flex items-center gap-3 px-4 py-3'
        >
          <div className='w-10 h-10 rounded bg-muted animate-pulse' />
          <div className='flex-1 h-4 bg-muted rounded animate-pulse' />
        </div>
      ))}
    </div>
  );
};
