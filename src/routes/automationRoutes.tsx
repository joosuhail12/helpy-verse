
import { lazy, Suspense, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoadingSpinner } from './index';

// Lazy load automation pages
const Automation = lazy(() => import('../pages/automation').catch(() => {
  console.error('Failed to load Automation page');
  throw new Error('Failed to load Automation page');
}));
const ActionCenter = lazy(() => import('../pages/automation/ActionCenter').catch(() => {
  console.error('Failed to load ActionCenter');
  throw new Error('Failed to load ActionCenter');
}));
const CreateAction = lazy(() => import('../pages/automation/CreateAction').catch(() => {
  console.error('Failed to load CreateAction');
  throw new Error('Failed to load CreateAction');
}));
const ChatbotProfiles = lazy(() => import('../pages/automation/ChatbotProfiles').catch(() => {
  console.error('Failed to load ChatbotProfiles');
  throw new Error('Failed to load ChatbotProfiles');
}));
const ChatbotDetail = lazy(() => import('../pages/automation/ChatbotDetail').catch(() => {
  console.error('Failed to load ChatbotDetail');
  throw new Error('Failed to load ChatbotDetail');
}));
const CreateChatbot = lazy(() => import('../pages/automation/CreateChatbot').catch(() => {
  console.error('Failed to load CreateChatbot');
  throw new Error('Failed to load CreateChatbot');
}));

// Helper to wrap components with Suspense and ProtectedRoute
const withSuspenseAndProtection = (component: ReactNode) => (
  <ProtectedRoute>
    <Suspense fallback={<LoadingSpinner />}>
      {component}
    </Suspense>
  </ProtectedRoute>
);

export const automationRoutes = [
  {
    path: 'home/automation',
    element: withSuspenseAndProtection(<Automation />),
    children: [
      {
        path: 'ai/action-center',
        element: <Suspense fallback={<LoadingSpinner />}><ActionCenter /></Suspense>,
      },
      {
        path: 'ai/action-center/create',
        element: <Suspense fallback={<LoadingSpinner />}><CreateAction /></Suspense>,
      },
      {
        path: 'ai/chatbot-profiles',
        element: <Suspense fallback={<LoadingSpinner />}><ChatbotProfiles /></Suspense>,
      },
      {
        path: 'ai/chatbot-profiles/create',
        element: <Suspense fallback={<LoadingSpinner />}><CreateChatbot /></Suspense>,
      },
      {
        path: 'ai/chatbot-profiles/:id',
        element: <Suspense fallback={<LoadingSpinner />}><ChatbotDetail /></Suspense>,
      },
    ],
  },
];
