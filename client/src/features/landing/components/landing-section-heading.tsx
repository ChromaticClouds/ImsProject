import type { ReactNode } from 'react';

type LandingSectionHeadingProps = {
  kicker: string;
  title: ReactNode;
  description?: string;
};

export const LandingSectionHeading = ({
  kicker,
  title,
  description,
}: LandingSectionHeadingProps) => {
  return (
    <div className='mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
      <div>
        <p className='mb-3 text-xs font-black uppercase text-violet-300'>
          {kicker}
        </p>
        <h2 className='text-3xl font-black leading-[1.12] text-white sm:text-4xl'>
          {title}
        </h2>
      </div>
      {description ? (
        <p className='max-w-[470px] text-sm leading-7 text-slate-300'>
          {description}
        </p>
      ) : null}
    </div>
  );
};
