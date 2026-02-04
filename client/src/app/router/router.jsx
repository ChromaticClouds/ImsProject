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

import { AuthBootstrap } from '@/app/router/auth-bootstrap.jsx';
import { Statistics } from '@/pages/dashboard/statistics.jsx';
import { VendorDetail } from '@/pages/vendor/vendor-detail.jsx';
import { VendorModify } from '@/pages/vendor/vendor-modify.jsx';
import { InboundPending } from '@/pages/inbound/inbound-pending.jsx';
import { InboundRegister } from '@/pages/inbound/inbound-register.jsx';
import { Adjust } from '@/pages/dashboard/adjust.jsx';

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
              {
                path: 'inbounds',
                children: [
                  { path: 'pending', element: <InboundPending /> },
                  {
                    path: 'register/:orderNumber',
                    element: <InboundRegister />,
                  },
                ],
              },
              { path: 'adjust', element: <Adjust /> },
              { path: 'statistics', element: <Statistics /> },
            ],
          },
        ],
      },
    ],
  },
]);
