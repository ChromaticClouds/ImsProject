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
import { AuthBootstrap } from '@/app/auth-bootstrap.jsx';
import { VendorDetail } from '@/pages/vendor/vendor-detail.jsx';


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
              {
                path: 'user/setting',
                element: <UserSetting />,
              },
              {
                path: 'vendor',
                children: [
                  { index: true, element: <VendorList /> },
                  { path: 'create', element: <VendorCreate /> },
                   { path: ':id', element: <VendorDetail /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
