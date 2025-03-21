
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PrivateRoute, PublicRoute } from '@/utils/helpers/Routes';
import ErrorBoundary from '../common/ErrorBoundary';

// Eager load important routes for better UX
import SignIn from '@/pages/SignIn';

// Lazy load other routes
const SignUp = lazy(() => import('@/pages/SignUp'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));
const InboxPage = lazy(() => import('@/pages/InboxPage'));
const ContactsPage = lazy(() => import('@/pages/ContactsPage'));
const ContactDetailPage = lazy(() => import('@/pages/ContactDetailPage'));
const CompaniesPage = lazy(() => import('@/pages/CompaniesPage'));
const CompanyDetailPage = lazy(() => import('@/pages/CompanyDetailPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const ChatWidgetStandalonePage = lazy(() => import('@/pages/widget/ChatWidgetStandalone'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/sign-in" 
          element={
            <PublicRoute>
              <ErrorBoundary>
                <SignIn />
              </ErrorBoundary>
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/sign-up" 
          element={
            <PublicRoute>
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <SignUp />
                </Suspense>
              </ErrorBoundary>
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/forgot-password" 
          element={
            <PublicRoute>
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <ForgotPassword />
                </Suspense>
              </ErrorBoundary>
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/reset-password" 
          element={
            <PublicRoute>
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <ResetPassword />
                </Suspense>
              </ErrorBoundary>
            </PublicRoute>
          } 
        />
        
        {/* Standalone Widget */}
        <Route 
          path="/widget/chat" 
          element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <ChatWidgetStandalonePage />
              </Suspense>
            </ErrorBoundary>
          } 
        />
        
        {/* Private routes */}
        <Route 
          path="/home/*" 
          element={
            <PrivateRoute>
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <DashboardLayout />
                </Suspense>
              </ErrorBoundary>
            </PrivateRoute>
          } 
        />
        
        {/* Redirect root to sign in */}
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
        
        {/* 404 route */}
        <Route 
          path="*" 
          element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <NotFound />
              </Suspense>
            </ErrorBoundary>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
