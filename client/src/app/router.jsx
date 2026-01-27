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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Auth /> },
      { path: 'register', element: <Auth /> },
      {
        path: 'dashboard',
        element: <Dashboard />,
        children: [
          { index: true, element: <Main /> },
          {
            path: 'user',
            children: [{ path: 'setting', element: <UserSetting /> }],
          },
        ],
      },
    ],
  },
]);
