// @ts-check

/**
 * Components
 */
import { AppSidebar } from '@/components/common/app-sidebar.js';
import { BackGround } from '@/components/common/background.js';
import { Outlet } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <BackGround direction='row'>
      <AppSidebar />
      <Outlet />
    </BackGround>
  );
};
