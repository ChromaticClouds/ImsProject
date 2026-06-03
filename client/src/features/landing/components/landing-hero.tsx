import { Link } from 'react-router-dom';
import { ArrowDownIcon, ArrowRightIcon } from 'lucide-react';

import { heroStats } from '@/features/landing/landing-data.js';
import { LandingShell } from './landing-shell.js';
import { LandingDashboardPreview } from './landing-dashboard-preview.js';

export const LandingHero = () => {
  return (
    <section
      id='top'
      className='relative overflow-hidden bg-[linear-gradient(135deg,#1d1130_0%,#0b0714_46%,#071715_100%)] py-12 sm:py-16 lg:py-20'
    >
      <LandingShell className='relative grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]'>
        <div className='relative z-10'>
          <div className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-black text-violet-100'>
            <span className='size-2 rounded-full bg-teal-300 shadow-[0_0_0_6px_rgba(94,234,212,0.14)]' />
            입고 · 출고 · 발주 · 재고 이력 통합 관리
          </div>
          <h1 className='mt-6 text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl'>
            재고 흐름을
            <br />
            한 화면에서
            <br />
            운영하는 IMS
          </h1>
          <p className='mt-5 max-w-[620px] text-base leading-8 text-slate-300 sm:text-lg'>
            품목과 거래처 등록부터 입출고 처리, 재고 조정, 이력 조회, 통계
            리포트, 발주서 작성과 전송 요청까지 실제 운영 흐름에 맞춰 연결하는
            재고 관리 시스템입니다.
          </p>

          <div className='mt-7 flex flex-wrap gap-3'>
            <Link
              to='/dashboard'
              className='inline-flex h-11 items-center gap-2 rounded-full bg-violet-500 px-5 text-sm font-black text-white shadow-[0_16px_40px_rgba(168,85,247,0.38)] transition hover:bg-violet-400'
            >
              시스템 시작하기
              <ArrowRightIcon className='size-4' />
            </Link>
            <a
              href='#features'
              className='inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white/15'
            >
              핵심 기능 보기
              <ArrowDownIcon className='size-4' />
            </a>
          </div>

          <div className='mt-7 grid max-w-[560px] grid-cols-3 gap-3'>
            {heroStats.map((item) => (
              <div
                key={item.label}
                className='rounded-2xl border border-white/10 bg-white/10 p-4'
              >
                <strong className='block text-xl font-black text-white'>
                  {item.value}
                </strong>
                <span className='text-xs font-semibold text-slate-400'>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <LandingDashboardPreview />
      </LandingShell>
    </section>
  );
};
