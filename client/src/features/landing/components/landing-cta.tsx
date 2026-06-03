import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';

import { ctaHighlights } from '@/features/landing/landing-data.js';
import { LandingShell } from './landing-shell.js';

export const LandingCta = () => {
  return (
    <section className='pb-20 pt-8'>
      <LandingShell>
        <div className='flex flex-col gap-7 rounded-[2rem] border border-white/15 bg-[linear-gradient(135deg,rgba(168,85,247,0.95),rgba(59,20,99,0.92))] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.34)] md:flex-row md:items-center md:justify-between md:p-10'>
          <div>
            <div className='mb-5 flex flex-wrap gap-2'>
              {ctaHighlights.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className='inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-white'
                >
                  <Icon className='size-3.5' />
                  {label}
                </span>
              ))}
            </div>
            <h2 className='max-w-[720px] text-3xl font-black leading-[1.15] text-white sm:text-4xl'>
              로그인 후 보호된 대시보드에서 실제 재고 업무를 이어가세요.
            </h2>
            <p className='mt-4 max-w-[680px] text-sm leading-7 text-violet-100'>
              홈에서는 IMS의 주요 화면과 업무 흐름을 소개하고, 실제 등록·조회·처리
              작업은 권한이 확인된 대시보드에서 진행합니다.
            </p>
          </div>
          <Link
            to='/login'
            className='inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-violet-950 transition hover:bg-violet-50'
          >
            로그인으로 이동
            <ArrowRightIcon className='size-4' />
          </Link>
        </div>
      </LandingShell>
    </section>
  );
};
