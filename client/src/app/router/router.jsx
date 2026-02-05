// @ts-check
import { createBrowserRouter } from 'react-router-dom';

/**
 * Pages
 */
import { App } from '@/app/app.jsx';
import { Home } from '@/pages/home.jsx';
import { Auth } from '@/pages/auth.jsx';
import { Dashboard } from '@/pages/dashboard/dashboard.jsx';
import { Main } from '@/pages/dashboard/main.jsx';
import { UserSetting } from '@/pages/dashboard/user-settiing.jsx';
import { VendorCreate } from '@/pages/vendor/vendor-create.jsx';
import { VendorList } from '@/pages/vendor/vendor-list.jsx';
import { authBootstrapLoader } from '@/app/loaders/auth-bootstrap-loader.js';
import { Product } from '@/pages/dashboard/product';
import { Notice } from '@/pages/dashboard/notice';

import { AuthBootstrap } from '@/app/router/auth-bootstrap.jsx';
import { Statistics } from '@/pages/dashboard/statistics.jsx';
import { VendorDetail } from '@/pages/vendor/vendor-detail.jsx';
import { VendorModify } from '@/pages/vendor/vendor-modify.jsx';

// ✅ inbounds
import { InboundRegister } from '@/pages/inbound/inbound-register.jsx';
import { Todo } from '@/pages/dashboard/todo';

/*
 * Notice pages
 */
import { NoticeDetail } from '@/features/notice/pages/notice-detail'; // 상세 페이지 나중에 제거 할 수도 있음
import { NoticeCreate } from '@/features/notice/pages/notice-create';
import { NoticeEdit } from '@/features/notice/pages/notice-edit';
import { InboundPendingEdit } from '@/pages/inbound/inbound-pending-edit.jsx';
import { InboundOverview } from '@/pages/inbound/inbound-overview.jsx';
import { Adjust } from '@/pages/dashboard/adjust';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Auth /> },
      { path: 'register', element: <Auth /> },

      {
        loader: authBootstrapLoader,
        element: <AuthBootstrap />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
            children: [
              { index: true, element: <Main /> },
              { path: 'product', element: <Product /> },
              {
                path: 'user',
                children: [
                  {
                    path: 'setting',
                    element: <UserSetting />,
                    handle: { permissions: ['ALL'] },
                  },
                ],
              },
              {
                path: 'vendor',
                children: [
                  { index: true, element: <VendorList /> },
                  { path: 'create', element: <VendorCreate /> },
                  { path: ':id', element: <VendorDetail /> },
                  { path: 'modify/:id', element: <VendorModify /> },
                ],
              },
              { path: 'statistics', element: <Statistics /> },
              {
                path: 'inbounds',
                children: [
                  { path: 'pending', element: <InboundOverview /> },
                  {
                    path: 'pending/edit/:orderNumber',
                    element: <InboundPendingEdit />,
                  },
                  {
                    path: 'register/:orderNumber',
                    element: <InboundRegister />,
                  },
                ],
              },
              { path: 'adjust', element: <Adjust /> },
              { path: 'statistics', element: <Statistics /> },
              {
                path: 'notice',

                children: [
                  { index: true, element: <Notice /> },
                  { path: 'create', element: <NoticeCreate /> },
                  { path: ':id', element: <NoticeDetail /> },
                  { path: ':id/edit', element: <NoticeEdit /> },
                ],
              },
              { path: 'todo', element: <Todo /> },
              {
                path: 'outbounds',
                children: [],
              },
              {
                path: 'adjust',
                element: <Adjust />,
              },
              {
                path: 'statistics',
                element: <Statistics />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
