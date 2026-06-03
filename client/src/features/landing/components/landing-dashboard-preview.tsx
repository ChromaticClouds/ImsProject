import {
  dashboardMenu,
  dashboardMetrics,
  dashboardTasks,
} from '@/features/landing/landing-data.js';

const barHeights = ['52%', '74%', '42%', '90%', '63%', '82%', '58%'];

export const LandingDashboardPreview = () => {
  return (
    <div className='relative mx-auto w-full max-w-[620px] lg:mr-0'>
      <div className='rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-[0_32px_100px_rgba(0,0,0,0.42)] lg:rotate-1'>
        <div className='grid min-h-[470px] overflow-hidden rounded-[1.5rem] bg-[#fbf8ff] text-[#251431] sm:grid-cols-[170px_1fr]'>
          <aside className='hidden border-r border-violet-100 bg-white p-5 sm:block'>
            <div className='mb-7 flex items-center gap-2 font-black text-violet-900'>
              <span className='grid size-8 place-items-center rounded-xl bg-violet-100 text-violet-600'>
                I
              </span>
              IMS
            </div>
            <div className='grid gap-2'>
              {dashboardMenu.map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${
                    index === 0
                      ? 'bg-violet-100 text-violet-900'
                      : 'text-slate-500'
                  }`}
                >
                  <span className='size-2 rounded-full bg-current opacity-40' />
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <section className='p-5'>
            <div className='mb-4 flex items-start justify-between gap-3'>
              <div>
                <h3 className='text-xl font-black'>IMS 업무 현황</h3>
                <p className='mt-1 text-xs leading-5 text-slate-500'>
                  주요 업무 화면과 통계 조회 흐름을 빠르게 탐색합니다.
                </p>
              </div>
              <div className='hidden rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-semibold text-slate-400 md:block'>
                품목명 / 브랜드 검색
              </div>
            </div>

            <div className='mb-4 grid grid-cols-3 gap-3'>
              {dashboardMetrics.map(([label, value, helper]) => (
                <div
                  key={label}
                  className='rounded-2xl border border-violet-100 bg-white p-3'
                >
                  <span className='text-[11px] font-bold text-slate-500'>
                    {label}
                  </span>
                  <strong className='mt-1 block text-2xl font-black'>
                    {value}
                  </strong>
                  <em className='text-[10px] font-black not-italic text-emerald-600'>
                    {helper}
                  </em>
                </div>
              ))}
            </div>

            <div className='grid gap-3 md:grid-cols-[1.15fr_0.85fr]'>
              <div className='rounded-3xl border border-violet-100 bg-white p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <b className='text-sm font-black'>입출고 수량 추이</b>
                  <span className='rounded-full bg-violet-100 px-3 py-1 text-[11px] font-black text-violet-700'>
                    기간
                  </span>
                </div>
                <div className='flex h-36 items-end gap-2'>
                  {barHeights.map((height, index) => (
                    <span
                      key={`${height}-${index}`}
                      className='flex-1 rounded-t-full rounded-b-md bg-gradient-to-b from-violet-500 to-violet-200'
                      style={{ height }}
                    />
                  ))}
                </div>
              </div>

              <div className='rounded-3xl border border-violet-100 bg-white p-4'>
                <div className='mb-3 flex items-center justify-between'>
                  <b className='text-sm font-black'>업무 바로가기</b>
                  <span className='rounded-full bg-fuchsia-100 px-3 py-1 text-[11px] font-black text-fuchsia-700'>
                    Route
                  </span>
                </div>
                <div className='grid gap-2'>
                  {dashboardTasks.map(([code, state]) => (
                    <div
                      key={code}
                      className='flex items-center justify-between rounded-xl bg-violet-50 px-3 py-2 text-[11px] font-black text-slate-600'
                    >
                      <span>{code}</span>
                      <span className='text-violet-700'>{state}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className='absolute -bottom-5 right-4 hidden max-w-[230px] rounded-3xl border border-white/50 bg-white/90 p-4 text-[#281432] shadow-2xl md:block'>
        <b className='block text-sm font-black'>발주서 전송 요청</b>
        <span className='mt-1 block text-xs leading-5 text-slate-500'>
          발주 목록에서 단건 또는 선택 건 전송을 요청하고 결과를 확인합니다.
        </span>
      </div>
    </div>
  );
};
