// @ts-check
import { createBrowserRouter } from 'react-router-dom';

/**
 * Pages
 */
import { App } from '@/app/app.jsx';

import { Auth } from '@/pages/auth.jsx';
import { Dashboard } from '@/pages/dashboard/dashboard.jsx';
import { Main } from '@/pages/dashboard/main.jsx';
import { UserSetting } from '@/pages/dashboard/user/user-settiing.jsx';
import { authBootstrapLoader } from '@/app/loaders/auth-bootstrap-loader.js';

import { AuthBootstrap } from '@/app/router/auth-bootstrap.jsx';
import { Statistics } from '@/pages/dashboard/statistics.jsx';

import { VendorCreate } from '@/pages/dashboard/vendor/vendor-create.jsx';
import { VendorList } from '@/pages/dashboard/vendor/vendor-list.jsx';
import { VendorEdit } from '@/pages/dashboard/vendor/vendor-edit.jsx';
import { VendorDetail } from '@/pages/dashboard/vendor/vendor-detail.jsx';

// product 품목
import { Product } from '@/pages/dashboard/product';

import { InboundRegister } from '@/pages/dashboard/inbound/inbound-register.jsx';

/*
 * Notice pages
 */
import { Notice } from '@/pages/dashboard/notice/notice';
import { NoticeDetail } from '@/pages/dashboard/notice/notice-detail';
import { NoticeCreate } from '@/pages/dashboard/notice/notice-create';
import { NoticeEdit } from '@/pages/dashboard/notice/notice-edit';
import { InboundPendingEdit } from '@/pages/dashboard/inbound/inbound-pending-edit.jsx';
import { InboundOverview } from '@/pages/dashboard/inbound/inbound-overview.jsx';
import { Adjust } from '@/pages/dashboard/adjust';

/*
 * Todo pages
 */
import { Todo } from '@/pages/dashboard/todo';
import { TodoCreate } from '@/features/todo/pages/todo-create';
import { TodoDetail } from '@/features/todo/pages/todo-detail';
import { TodoEdit } from '@/features/todo/pages/todo-edit';

// purchase-order pages
import { PurchaseOrder } from '@/pages/dashboard/purchase-order/purchase-order';
import { PurchaseOrderEdit } from '@/features/purchase-order/pages/purchase-order-edit';

import { OutboundPending } from '@/pages/dashboard/outbound/outbound-pending.jsx';
import { OutboundRegister } from '@/pages/dashboard/outbound/outbound-regiester.jsx';
import { HistoryPage } from '@/pages/dashboard/history.jsx';
import { ReceiveOrder } from '@/pages/dashboard/receive-order/receive-order.jsx';
import { ReceiveOrderPost } from '@/pages/dashboard/receive-order/receive-order-post.jsx';
import { ForgotPassword } from '@/pages/forgot-password.jsx';
import { PasswordReset } from '@/pages/password-reset.jsx';
import { PurchaseOrderPost } from '@/pages/dashboard/purchase-order/purchase-order-post.jsx';
import { UserGroup } from '@/pages/dashboard/user/user-group.jsx';
import { ErrorBoundary } from '@/pages/error-boundary.jsx';
import { LandingPage } from '@/pages/landing-page.js';

export const router = createBrowserRouter([
  { path: '*', element: <ErrorBoundary /> },
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <Auth /> },
      { path: 'register', element: <Auth /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'password-reset', element: <PasswordReset /> },

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
                    handle: { permissions: ['ALL'], minRank: 3 },
                  },
                  { path: 'group', element: <UserGroup /> },
                ],
              },
              {
                path: 'vendor',
                children: [
                  { index: true, element: <VendorList /> },
                  { path: 'create', element: <VendorCreate /> },
                  { path: ':id', element: <VendorDetail /> },
                  { path: 'modify/:id', element: <VendorEdit /> },
                ],
                handle: {
                  permissions: ['ALL'],
                  minRank: 3,
                },
              },
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
                handle: {
                  permissions: ['INBOUND', 'ALL'],
                  minRank: 1,
                },
              },
              {
                path: 'notice',
                children: [
                  { index: true, element: <Notice /> },
                  {
                    path: 'create',
                    element: <NoticeCreate />,
                    handle: {
                      permissions: ['ALL'],
                      minRank: 3,
                    },
                  },
                  { path: ':id', element: <NoticeDetail /> },
                  {
                    path: ':id/edit',
                    element: <NoticeEdit />,
                    handle: {
                      permissions: ['ALL'],
                      minRank: 3,
                    },
                  },
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
                  { path: 'pending', element: <OutboundPending /> },
                  {
                    path: 'register/:orderNumber',
                    element: <OutboundRegister />,
                  },
                ],
                handle: {
                  permissions: ['OUTBOUND', 'ALL'],
                  minRank: 1,
                },
              },
              {
                path: 'adjust',
                element: <Adjust />,
                handle: {
                  permissions: ['ALL'],
                  minRank: 2,
                },
              },
              { path: 'statistics', element: <Statistics /> },
              {
                path: 'purchase-order',
                children: [
                  { index: true, element: <PurchaseOrder /> },
                  { path: ':orderNumber/edit', element: <PurchaseOrderEdit /> },
                  { path: 'create', element: <PurchaseOrderPost /> },
                  { path: ':id/edit', element: <PurchaseOrderEdit /> },
                ],
                handle: {
                  permissions: ['PLACE_ORDER', 'ALL'],
                  minRank: 1,
                },
              },
              {
                path: 'history',
                element: <HistoryPage />,
              },
              {
                path: 'receive-order',
                children: [
                  { index: true, element: <ReceiveOrder /> },
                  { path: 'post', element: <ReceiveOrderPost /> },
                ],
                handle: {
                  permissions: ['RECEIVE_ORDER', 'ALL'],
                  minRank: 1,
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);
