import { Link } from 'react-router-dom';
import { ArrowRightIcon, LogInIcon } from 'lucide-react';

import { landingNavItems } from '@/features/landing/landing-data.js';
import { LandingShell } from './landing-shell.js';

export const LandingNav = () => {
  return (
    <header className='sticky top-0 z-30 border-b border-white/10 bg-[#0b0714]/80 backdrop-blur-xl'>
      <LandingShell className='flex h-16 items-center justify-between gap-4'>
        <a
          href='#top'
          className='flex items-center gap-3 text-white'
          aria-label='IMS Project home'
        >
          <span className='grid size-10 place-items-center rounded-2xl bg-white text-sm font-black text-violet-700 shadow-[0_18px_50px_rgba(168,85,247,0.32)]'>
            I
          </span>
          <span className='leading-none'>
            <b className='block text-sm font-black'>IMS Project</b>
            <small className='text-[11px] font-semibold text-slate-400'>
              Inventory Management System
            </small>
          </span>
        </a>

        <nav
          className='hidden items-center gap-6 text-sm font-semibold text-slate-300 md:flex'
          aria-label='랜딩 페이지 주요 메뉴'
        >
          {landingNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className='transition hover:text-white'
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className='flex items-center gap-2'>
          <Link
            to='/login'
            className='hidden h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-bold text-white transition hover:bg-white/10 sm:inline-flex'
          >
            <LogInIcon className='size-4' />
            로그인
          </Link>
          <Link
            to='/dashboard'
            className='inline-flex h-10 items-center gap-2 rounded-full bg-violet-500 px-4 text-sm font-black text-white shadow-[0_14px_35px_rgba(168,85,247,0.35)] transition hover:bg-violet-400'
          >
            대시보드 보기
            <ArrowRightIcon className='size-4' />
          </Link>
        </div>
      </LandingShell>
    </header>
  );
};
