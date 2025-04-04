
import { lazy, Suspense, ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

// Export routes array for use in router configuration
export const AutomationRoutes = [
  { path: "automation", element: withSuspenseAndProtection(<Automation />) },
  { path: "automation/ai/action-center", element: withSuspenseAndProtection(<ActionCenter />) },
  { path: "automation/ai/action-center/create", element: withSuspenseAndProtection(<CreateAction />) },
  { path: "automation/ai/chatbot-profiles", element: withSuspenseAndProtection(<ChatbotProfiles />) },
  { path: "automation/ai/chatbot-profiles/create", element: withSuspenseAndProtection(<CreateChatbot />) },
  { path: "automation/ai/chatbot-profiles/:id", element: withSuspenseAndProtection(<ChatbotDetail />) },
  { path: "automation/ai/content-center", element: withSuspenseAndProtection(<ContentCenter />) }
];

// Also export as a component for direct usage
export const AutomationRoutesComponent = () => {
  return (
    <Routes>
      <Route path="" element={withSuspenseAndProtection(<Automation />)} />
      <Route path="ai/action-center" element={withSuspenseAndProtection(<ActionCenter />)} />
      <Route path="ai/action-center/create" element={withSuspenseAndProtection(<CreateAction />)} />
      <Route path="ai/chatbot-profiles" element={withSuspenseAndProtection(<ChatbotProfiles />)} />
      <Route path="ai/chatbot-profiles/create" element={withSuspenseAndProtection(<CreateChatbot />)} />
      <Route path="ai/chatbot-profiles/:id" element={withSuspenseAndProtection(<ChatbotDetail />)} />
      <Route path="ai/content-center" element={withSuspenseAndProtection(<ContentCenter />)} />
    </Routes>
  );
};
