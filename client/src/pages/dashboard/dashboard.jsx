// @ts-check

/**
 * Components
 */
import { AppSidebar } from '@/components/common/app-sidebar.jsx';
import { BackGround } from '@/components/common/background.js';
import { Outlet } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <BackGround direction='row'>
      <AppSidebar />
      <main className='w-full h-full flex flex-col'>
        <Outlet />
      </main>
    </BackGround>
  );
};
