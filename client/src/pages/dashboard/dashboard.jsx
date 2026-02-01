// @ts-check

/**
 * Components
 */
import { AppSidebar } from '@/components/common/app-sidebar.jsx';
import { BackGround } from '@/components/common/background.js';
import { MainBackground } from '@/components/common/main-background.jsx';
import { Outlet } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <BackGround direction='row'>
      <AppSidebar />
      <MainBackground>
        <Outlet />
      </MainBackground>
    </BackGround>
  );
};
