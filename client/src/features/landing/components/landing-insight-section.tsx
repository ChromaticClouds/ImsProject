import { analyticsRows, operationRows } from '@/features/landing/landing-data.js';
import { LandingShell } from './landing-shell.js';

const statusClassName = {
  '권한 필요': 'bg-violet-500/20 text-violet-100',
  관리자: 'bg-amber-300/15 text-amber-100',
};

export const LandingInsightSection = () => {
  return (
    <section
      id='analytics'
      className='py-16'
    >
      <LandingShell className='grid gap-6 lg:grid-cols-[0.92fr_1.08fr]'>
        <div className='rounded-3xl border border-white/10 bg-white/[0.08] p-7'>
          <p className='mb-3 text-xs font-black uppercase text-violet-300'>
            Analytics
          </p>
          <h2 className='text-3xl font-black leading-[1.12] text-white sm:text-4xl'>
            관리자에게 필요한 통계를 전면 배치
          </h2>
          <p className='mt-4 text-sm leading-7 text-slate-300'>
            통계 화면에서 제공되는 차트와 조건 조회를 중심으로 운영 흐름을
            읽을 수 있게 구성합니다.
          </p>
          <div className='mt-6 grid gap-3'>
            {analyticsRows.map(([label, value]) => (
              <div
                key={label}
                className='flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-300'
              >
                <span>{label}</span>
                <b className='font-black text-white'>{value}</b>
              </div>
            ))}
          </div>
        </div>

        <div
          id='operations'
          className='rounded-3xl border border-white/10 bg-white/[0.08] p-7'
        >
          <p className='mb-3 text-xs font-black uppercase text-violet-300'>
            Operations
          </p>
          <h2 className='text-3xl font-black leading-[1.12] text-white sm:text-4xl'>
            권한이 필요한 화면을 명확하게
          </h2>
          <div className='mt-6 grid gap-3'>
            <div className='grid grid-cols-[1fr_0.8fr_64px] gap-3 rounded-2xl bg-white/15 px-4 py-3 text-sm font-black text-white'>
              <span>화면</span>
              <span>접근 기준</span>
              <span>구분</span>
            </div>
            {operationRows.map(([task, permission, status]) => (
              <div
                key={task}
                className='grid grid-cols-[1fr_0.8fr_64px] items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-xs text-slate-300 sm:text-sm'
              >
                <span>{task}</span>
                <span>{permission}</span>
                <span
                  className={`w-fit rounded-full px-2 py-1 text-[11px] font-black ${
                    statusClassName[status as keyof typeof statusClassName]
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </LandingShell>
    </section>
  );
};
