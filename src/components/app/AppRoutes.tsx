
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PrivateRoute, PublicRoute } from '@/utils/helpers/Routes';
import ErrorBoundary from '../common/ErrorBoundary';

// Eager load important routes for better UX
import SignIn from '@/pages/SignIn';
import LandingPage from '@/pages/LandingPage';

// Lazy load other routes
const SignUp = lazy(() => import('@/pages/SignUp'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));

// Correct paths for inbox, contacts, and other pages
const InboxPage = lazy(() => import('@/pages/Inbox'));
const ContactsPage = lazy(() => import('@/pages/Contacts'));
const ContactDetailPage = lazy(() => import('@/pages/contacts/Detail'));
const CompaniesPage = lazy(() => import('@/pages/contacts/Companies'));
const CompanyDetailPage = lazy(() => import('@/pages/contacts/CompanyDetail'));
const SettingsPage = lazy(() => import('@/pages/Settings'));
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
          path="/" 
          element={
            <PublicRoute>
              <ErrorBoundary>
                <LandingPage />
              </ErrorBoundary>
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/index" 
          element={
            <PublicRoute>
              <ErrorBoundary>
                <LandingPage />
              </ErrorBoundary>
            </PublicRoute>
          } 
        />
        
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
