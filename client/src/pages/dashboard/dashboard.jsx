// @ts-check

/**
 * Components
 */
import { AppSidebar } from '@/components/common/app-sidebar.jsx';
import { BackGround } from '@/components/common/background.js';
import { MainBackground } from '@/components/common/main-background.jsx';
import { SidebarTrigger } from '@/components/ui/sidebar.js';
import { Outlet } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <BackGround direction='row'>
      <AppSidebar />
      <SidebarTrigger
        className='fixed top-4 left-4 z-40 size-10 border bg-background shadow-sm lg:hidden'
        aria-label='메뉴 열기'
      />
      <MainBackground>
        <Outlet />
      </MainBackground>
    </BackGround>
  );
};
