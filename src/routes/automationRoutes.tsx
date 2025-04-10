
import * as React from 'react';
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

// Import Automation directly to avoid lazy-loading the parent
import Automation from '../pages/automation';
import Workflows from '../pages/automation/Workflows';
import WorkflowsPage from '../pages/automation/WorkflowsPage';
import WorkflowBuilderPage from '../pages/automation/WorkflowBuilderPage';

// Lazy load child pages for better performance
const ActionCenter = React.lazy(() => import('../pages/automation/ActionCenter'));
const CreateAction = React.lazy(() => import('../pages/automation/CreateAction'));
const ChatbotProfiles = React.lazy(() => import('../pages/automation/ChatbotProfiles'));
const ChatbotDetail = React.lazy(() => import('../pages/automation/ChatbotDetail'));
const CreateChatbot = React.lazy(() => import('../pages/automation/CreateChatbot'));
const ContentCenter = React.lazy(() => import('../pages/automation/ContentCenter'));

// Helper to wrap components with Suspense, ProtectedRoute and RouteErrorBoundary
const withSuspenseAndProtection = (component) => (
  <ProtectedRoute>
    <RouteErrorBoundary>
      <React.Suspense fallback={<LoadingSpinner />}>
        {component}
      </React.Suspense>
    </RouteErrorBoundary>
  </ProtectedRoute>
);

export const automationRoutes = [
  {
    path: 'automation',
    element: (
      <ProtectedRoute>
        <Automation />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'ai/action-center',
        element: <RouteErrorBoundary><React.Suspense fallback={<LoadingSpinner />}><ActionCenter /></React.Suspense></RouteErrorBoundary>,
      },
      {
        path: 'ai/action-center/create',
        element: <RouteErrorBoundary><React.Suspense fallback={<LoadingSpinner />}><CreateAction /></React.Suspense></RouteErrorBoundary>,
      },
      {
        path: 'ai/chatbot-profiles',
        element: <RouteErrorBoundary><React.Suspense fallback={<LoadingSpinner />}><ChatbotProfiles /></React.Suspense></RouteErrorBoundary>,
      },
      {
        path: 'ai/chatbot-profiles/create',
        element: <RouteErrorBoundary><React.Suspense fallback={<LoadingSpinner />}><CreateChatbot /></React.Suspense></RouteErrorBoundary>,
      },
      {
        path: 'ai/chatbot-profiles/:id',
        element: <RouteErrorBoundary><React.Suspense fallback={<LoadingSpinner />}><ChatbotDetail /></React.Suspense></RouteErrorBoundary>,
      },
      {
        path: 'ai/content-center',
        element: <RouteErrorBoundary><React.Suspense fallback={<LoadingSpinner />}><ContentCenter /></React.Suspense></RouteErrorBoundary>,
      },
      {
        path: 'workflows',
        element: <RouteErrorBoundary><Workflows /></RouteErrorBoundary>,
      },
      // Changed route pattern to match the new URL structure
      {
        path: 'workflows/new/:workflowId',
        element: <RouteErrorBoundary><WorkflowBuilderPage /></RouteErrorBoundary>,
      },
      // Add default redirect
      {
        path: '',
        element: <Navigate to="workflows" replace />,
      },
    ],
  },
];
