
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Layout components
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));

// Page components
const Home = lazy(() => import('@/pages/Home'));
const Automation = lazy(() => import('@/pages/automation'));
const ActionCenter = lazy(() => import('@/pages/automation/ActionCenter'));
const ActionDetail = lazy(() => import('@/pages/automation/ActionDetail'));
const CreateAction = lazy(() => import('@/pages/automation/CreateAction'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'home',
        element: <Home />,
        children: [
          {
            path: 'automation',
            element: <Automation />,
            children: [
              {
                path: 'ai/action-center',
                element: (
                  <ProtectedRoute>
                    <ActionCenter />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'ai/action-center/:actionId',
                element: (
                  <ProtectedRoute>
                    <ActionDetail />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'ai/action-center/create',
                element: (
                  <ProtectedRoute>
                    <CreateAction />
                  </ProtectedRoute>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);
