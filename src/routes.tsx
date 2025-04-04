
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingFallback from './components/app/LoadingFallback';

// Correctly lazy load route components by importing the component exports
const DashboardRoutes = lazy(() => import('./routes/dashboardRoutes').then(module => ({ default: () => <module.DashboardRoutesComponent /> })));
const InboxRoutes = lazy(() => import('./routes/inboxRoutes').then(module => ({ default: () => <module.InboxRoutesComponent /> })));
const SettingsRoutes = lazy(() => import('./routes/settingsRoutes'));
const AutomationRoutes = lazy(() => import('./routes/automationRoutes').then(module => ({ default: () => <module.AutomationRoutesComponent /> })));

// Auth pages
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

// Main router component with lazy-loaded routes
const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Main application routes */}
        <Route path="/dashboard/*" element={
          <Suspense fallback={<LoadingFallback />}>
            <DashboardRoutes />
          </Suspense>
        } />
        
        <Route path="/inbox/*" element={
          <Suspense fallback={<LoadingFallback />}>
            <InboxRoutes />
          </Suspense>
        } />
        
        <Route path="/settings/*" element={
          <Suspense fallback={<LoadingFallback />}>
            <SettingsRoutes />
          </Suspense>
        } />
        
        <Route path="/automation/*" element={
          <Suspense fallback={<LoadingFallback />}>
            <AutomationRoutes />
          </Suspense>
        } />
        
        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
