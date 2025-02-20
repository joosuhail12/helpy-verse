
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Layout components
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));

// Page components
const Home = lazy(() => import('@/pages/Home'));
const Automation = lazy(() => import('@/pages/automation'));
const ActionCenter = lazy(() => import('@/pages/automation/ActionCenter'));
const CreateAction = lazy(() => import('@/pages/automation/CreateAction'));
const ChatbotProfiles = lazy(() => import('@/pages/automation/ChatbotProfiles'));
const ChatbotDetail = lazy(() => import('@/pages/automation/ChatbotDetail'));
const CreateChatbot = lazy(() => import('@/pages/automation/CreateChatbot'));

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
                path: 'ai/action-center/create',
                element: (
                  <ProtectedRoute>
                    <CreateAction />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'ai/chatbot-profiles',
                element: (
                  <ProtectedRoute>
                    <ChatbotProfiles />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'ai/chatbot-profiles/create',
                element: (
                  <ProtectedRoute>
                    <CreateChatbot />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'ai/chatbot-profiles/:id',
                element: (
                  <ProtectedRoute>
                    <ChatbotDetail />
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
