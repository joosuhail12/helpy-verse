
import { lazy, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRouteWrapper from '@/components/auth/ProtectedRouteWrapper';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

// Lazy load automation pages with error handling
const Automation = lazy(() => import('../pages/automation').catch((err) => {
  console.error('Failed to load Automation page:', err);
  throw new Error('Failed to load Automation page');
}));
const ActionCenter = lazy(() => import('../pages/automation/ActionCenter').catch((err) => {
  console.error('Failed to load ActionCenter:', err);
  throw new Error('Failed to load ActionCenter');
}));
const CreateAction = lazy(() => import('../pages/automation/CreateAction').catch((err) => {
  console.error('Failed to load CreateAction:', err);
  throw new Error('Failed to load CreateAction');
}));
const ChatbotProfiles = lazy(() => import('../pages/automation/ChatbotProfiles').catch((err) => {
  console.error('Failed to load ChatbotProfiles:', err);
  throw new Error('Failed to load ChatbotProfiles');
}));
const ChatbotDetail = lazy(() => import('../pages/automation/ChatbotDetail').catch((err) => {
  console.error('Failed to load ChatbotDetail:', err);
  throw new Error('Failed to load ChatbotDetail');
}));
const CreateChatbot = lazy(() => import('../pages/automation/CreateChatbot').catch((err) => {
  console.error('Failed to load CreateChatbot:', err);
  throw new Error('Failed to load CreateChatbot');
}));
const ContentCenter = lazy(() => import('../pages/automation/ContentCenter').catch((err) => {
  console.error('Failed to load ContentCenter:', err);
  throw new Error('Failed to load ContentCenter');
}));

// Helper function to wrap components with protection
const withProtection = (component: ReactNode) => (
  <ProtectedRouteWrapper>
    {component}
  </ProtectedRouteWrapper>
);

// Helper for child routes that need just error boundary and suspense
const withSuspenseOnly = (Component: React.ComponentType) => (
  <RouteErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  </RouteErrorBoundary>
);

export const automationRoutes = [
  {
    path: 'automation',
    element: withProtection(<Automation />),
    children: [
      {
        path: 'ai/action-center',
        element: withSuspenseOnly(ActionCenter),
      },
      {
        path: 'ai/action-center/create',
        element: withSuspenseOnly(CreateAction),
      },
      {
        path: 'ai/chatbot-profiles',
        element: withSuspenseOnly(ChatbotProfiles),
      },
      {
        path: 'ai/chatbot-profiles/create',
        element: withSuspenseOnly(CreateChatbot),
      },
      {
        path: 'ai/chatbot-profiles/:id',
        element: withSuspenseOnly(ChatbotDetail),
      },
      {
        path: 'ai/content-center',
        element: withSuspenseOnly(ContentCenter),
      },
    ],
  },
];
