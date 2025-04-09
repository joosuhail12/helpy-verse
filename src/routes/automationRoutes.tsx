
import React, { lazy, Suspense, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';

// Define LoadingSpinner explicitly in this file to avoid reference errors
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

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
const Workflows = lazy(() => import('../pages/automation/Workflows').catch((err) => {
  console.error('Failed to load Workflows:', err);
  throw new Error('Failed to load Workflows');
}));

// Helper to wrap components with Suspense, ProtectedRoute and RouteErrorBoundary
const withSuspenseAndProtection = (component: ReactNode) => (
  <ProtectedRoute>
    <RouteErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        {component}
      </Suspense>
    </RouteErrorBoundary>
  </ProtectedRoute>
);

export const automationRoutes = [
  {
    path: 'automation',
    element: withSuspenseAndProtection(<Automation />),
    children: [
      {
        path: 'ai/action-center',
        element: <RouteErrorBoundary><Suspense fallback={<LoadingSpinner />}><ActionCenter /></Suspense></RouteErrorBoundary>,
      },
      {
        path: 'ai/action-center/create',
        element: <RouteErrorBoundary><Suspense fallback={<LoadingSpinner />}><CreateAction /></Suspense></RouteErrorBoundary>,
      },
      {
        path: 'ai/chatbot-profiles',
        element: <RouteErrorBoundary><Suspense fallback={<LoadingSpinner />}><ChatbotProfiles /></Suspense></RouteErrorBoundary>,
      },
      {
        path: 'ai/chatbot-profiles/create',
        element: <RouteErrorBoundary><Suspense fallback={<LoadingSpinner />}><CreateChatbot /></Suspense></RouteErrorBoundary>,
      },
      {
        path: 'ai/chatbot-profiles/:id',
        element: <RouteErrorBoundary><Suspense fallback={<LoadingSpinner />}><ChatbotDetail /></Suspense></RouteErrorBoundary>,
      },
      {
        path: 'ai/content-center',
        element: <RouteErrorBoundary><Suspense fallback={<LoadingSpinner />}><ContentCenter /></Suspense></RouteErrorBoundary>,
      },
      {
        path: 'workflows',
        element: <RouteErrorBoundary><Suspense fallback={<LoadingSpinner />}><Workflows /></Suspense></RouteErrorBoundary>,
      },
    ],
  },
];
