
import React, { lazy } from 'react';
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

// Lazy load child pages for better performance
const ActionCenter = lazy(() => import('../pages/automation/ActionCenter'));
const CreateAction = lazy(() => import('../pages/automation/CreateAction'));
const ChatbotProfiles = lazy(() => import('../pages/automation/ChatbotProfiles'));
const ChatbotDetail = lazy(() => import('../pages/automation/ChatbotDetail'));
const CreateChatbot = lazy(() => import('../pages/automation/CreateChatbot'));
const ContentCenter = lazy(() => import('../pages/automation/ContentCenter'));
const Workflows = lazy(() => import('../pages/automation/Workflows'));
const WorkflowBuilderPage = lazy(() => import('../pages/automation/WorkflowBuilderPage'));

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
        element: <RouteErrorBoundary><React.Suspense fallback={<LoadingSpinner />}><Workflows /></React.Suspense></RouteErrorBoundary>,
      },
      {
        path: 'workflows/new/trigger/:triggerId',
        element: <RouteErrorBoundary><React.Suspense fallback={<LoadingSpinner />}><WorkflowBuilderPage /></React.Suspense></RouteErrorBoundary>,
      },
      // Add default redirect
      {
        path: '',
        element: <Navigate to="workflows" replace />,
      },
    ],
  },
];
