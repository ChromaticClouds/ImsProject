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

import { AuthBootstrap } from '@/app/router/auth-bootstrap.jsx';
import { Statistics } from '@/pages/dashboard/statistics.jsx';
import { VendorDetail } from '@/pages/vendor/vendor-detail.jsx';
import { VendorModify } from '@/pages/vendor/vendor-modify.jsx';

// product 품목
import { Product } from '@/pages/dashboard/product';
import { InboundRegister } from '@/pages/inbound/inbound-register.jsx';

/*
 * Notice pages
 */
import { Notice } from '@/pages/dashboard/notice';
import { NoticeDetail } from '@/features/notice/pages/notice-detail';
import { NoticeCreate } from '@/features/notice/pages/notice-create';
import { NoticeEdit } from '@/features/notice/pages/notice-edit';
import { InboundPendingEdit } from '@/pages/inbound/inbound-pending-edit.jsx';
import { InboundOverview } from '@/pages/inbound/inbound-overview.jsx';
import { Adjust } from '@/pages/dashboard/adjust';

/*
 * Todo pages
 */
import { Todo } from '@/pages/dashboard/todo';
import { TodoCreate } from '@/features/todo/pages/todo-create';
import { TodoDetail } from '@/features/todo/pages/todo-detail';
import { TodoEdit } from '@/features/todo/pages/todo-edit';

// purchase-order pages
import { PurchaseOrder } from '@/pages/dashboard/purchase-order';
import { PurchaseOrderCreate } from '@/features/purchase-order/pages/purchse-order-create';
import { PurchaseOrderEdit } from '@/features/purchase-order/pages/purchase-order-edit';

import { OutboundPending } from '@/pages/outbound/outbound-pending.jsx';
import { OutboundRegister } from '@/pages/outbound/outbound-regiester.jsx';
import { HistoryPage } from '@/pages/dashboard/history.jsx';
import { ReceiveOrder } from '@/pages/dashboard/receive-order/receive-order.jsx';
import { ReceiveOrderPost } from '@/pages/dashboard/receive-order/receive-order-post.jsx';
import { ForgotPassword } from '@/pages/forgot-password.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Auth /> },
      { path: 'register', element: <Auth /> },
      { path: 'forgot-password', element: <ForgotPassword /> },

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
              {
                path: 'notice',

                children: [
                  { index: true, element: <Notice /> },
                  { path: 'create', element: <NoticeCreate /> },
                  { path: ':id', element: <NoticeDetail /> },
                  { path: ':id/edit', element: <NoticeEdit /> },
                ],
              },

              {
                path: 'todo',
                children: [
                  { index: true, element: <Todo /> },
                  { path: 'create', element: <TodoCreate /> },
                  { path: ':id', element: <TodoDetail /> },
                  { path: ':id/edit', element: <TodoEdit /> },
                ],
              },

              {
                path: 'outbounds',
                children: [
                  {
                    path: 'pending',
                    element: <OutboundPending />,
                  },
                  {
                    path: 'register/:orderNumber',
                    element: <OutboundRegister />,
                  },
                ],
              },
              {
                path: 'adjust',
                element: <Adjust />,
              },
              {
                path: 'statistics',
                element: <Statistics />,
              },
              {
                path: 'purchase-order',
                children: [
                  { index: true, element: <PurchaseOrder /> },
                  { path: 'create', element: <PurchaseOrderCreate /> },
                  { path: ':id/edit', element: <PurchaseOrderEdit /> },
                ],
              },
              {
                path: 'history',
                element: <HistoryPage />,
              },
              {
                path: 'purchase-order',
                element: <PurchaseOrder />,
              },
              {
                path: 'receive-order',
                children: [
                  { index: true, element: <ReceiveOrder /> },
                  { path: 'post', element: <ReceiveOrderPost /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
