
import * as React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingFallback from './LoadingFallback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import RootRedirect from './RootRedirect';
import RouteErrorBoundary from '@/components/app/RouteErrorBoundary';
import { automationRoutes } from '@/routes/automationRoutes';

// Import directly instead of lazy loading for critical components
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import AllInbox from '@/pages/inbox/All';
import YourInbox from '@/pages/inbox/YourInbox';
import UnassignedInbox from '@/pages/inbox/Unassigned';
import MentionsInbox from '@/pages/inbox/Mentions';
import SignIn from '@/pages/SignIn';
import Contacts from '@/pages/Contacts';
import AllContacts from '@/pages/contacts/All';
// Import Workflows directly - since we need it in the routes
import WorkflowsComponent from '@/pages/automation/Workflows';
// Import WorkflowBuilderPage directly to avoid dynamic import issues
import WorkflowBuilderPage from '@/pages/automation/WorkflowBuilderPage';

// Lazy load non-critical pages
const ForgotPassword = React.lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('@/pages/ResetPassword'));
const SignUp = React.lazy(() => import('@/pages/SignUp'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const LandingPage = React.lazy(() => import('@/pages/LandingPage'));
const Companies = React.lazy(() => import('@/pages/contacts/Companies'));
const CompanyDetail = React.lazy(() => import('@/pages/contacts/CompanyDetail'));
const ContactDetail = React.lazy(() => import('@/pages/contacts/Detail'));

/**
 * Main routing component for the application
 * Uses React Router v6 for declarative routing
 */
const AppRoutes: React.FC = () => {
  console.log('AppRoutes rendering');
  
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<RootRedirect />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forgot-password" element={
          <React.Suspense fallback={<LoadingFallback />}>
            <ForgotPassword />
          </React.Suspense>
        } />
        <Route path="/reset-password" element={
          <React.Suspense fallback={<LoadingFallback />}>
            <ResetPassword />
          </React.Suspense>
        } />
        <Route path="/sign-up" element={
          <React.Suspense fallback={<LoadingFallback />}>
            <SignUp />
          </React.Suspense>
        } />
        
        {/* Protected dashboard routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <RouteErrorBoundary>
              <DashboardLayout />
            </RouteErrorBoundary>
          </ProtectedRoute>
        }>
          {/* Dashboard route - direct import */}
          <Route path="" element={
            <RouteErrorBoundary>
              <Dashboard />
            </RouteErrorBoundary>
          } />
          
          {/* Contacts routes */}
          <Route path="contacts" element={<Contacts />}>
            <Route path="" element={<Navigate to="all" replace />} />
            <Route path="all" element={
              <RouteErrorBoundary>
                <AllContacts />
              </RouteErrorBoundary>
            } />
            <Route path="companies" element={
              <RouteErrorBoundary>
                <React.Suspense fallback={<LoadingFallback />}>
                  <Companies />
                </React.Suspense>
              </RouteErrorBoundary>
            } />
            <Route path="companies/:id" element={
              <RouteErrorBoundary>
                <React.Suspense fallback={<LoadingFallback />}>
                  <CompanyDetail />
                </React.Suspense>
              </RouteErrorBoundary>
            } />
            <Route path=":id" element={
              <RouteErrorBoundary>
                <React.Suspense fallback={<LoadingFallback />}>
                  <ContactDetail />
                </React.Suspense>
              </RouteErrorBoundary>
            } />
          </Route>

          {/* Inbox routes */}
          <Route path="inbox">
            <Route path="" element={<Navigate to="all" replace />} />
            <Route path="all" element={
              <RouteErrorBoundary>
                <AllInbox />
              </RouteErrorBoundary>
            } />
            <Route path="your-inbox" element={
              <RouteErrorBoundary>
                <YourInbox />
              </RouteErrorBoundary>
            } />
            <Route path="unassigned" element={
              <RouteErrorBoundary>
                <UnassignedInbox />
              </RouteErrorBoundary>
            } />
            <Route path="mentions" element={
              <RouteErrorBoundary>
                <MentionsInbox />
              </RouteErrorBoundary>
            } />
          </Route>
          
          {/* Automation routes - directly import Workflows component */}
          <Route path="automation">
            <Route path="" element={<Navigate to="workflows" replace />} />
            <Route path="workflows" element={
              <RouteErrorBoundary>
                <WorkflowsComponent />
              </RouteErrorBoundary>
            } />
            <Route path="workflows/new/trigger/:triggerId" element={
              <RouteErrorBoundary>
                <WorkflowBuilderPage />
              </RouteErrorBoundary>
            } />
            {/* Add additional automation routes as needed */}
          </Route>
        </Route>
        
        {/* Not found route */}
        <Route path="*" element={
          <React.Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </React.Suspense>
        } />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
