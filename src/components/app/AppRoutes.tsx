
import * as React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingFallback from './LoadingFallback';
import { lazily } from '@/utils/lazy';

// Lazily import layouts and pages
const DashboardLayout = React.lazy(() => import('@/layouts/DashboardLayout'));

// Import route configs
import { dashboardRoutes } from '@/routes/dashboardRoutes';
import { inboxRoutes } from '@/routes/inboxRoutes';
import { settingsRoutes } from '@/routes/settingsRoutes';
import { automationRoutes } from '@/routes/automationRoutes';

// Lazily load auth pages
const { SignIn } = lazily(() => import('@/pages/SignIn'));
const { ForgotPassword } = lazily(() => import('@/pages/ForgotPassword'));
const { ResetPassword } = lazily(() => import('@/pages/ResetPassword'));
const { SignUp } = lazily(() => import('@/pages/SignUp'));
const { NotFound } = lazily(() => import('@/pages/NotFound'));
const { LandingPage } = lazily(() => import('@/pages/LandingPage'));

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Navigate to="/home/inbox/all" replace />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/sign-up" element={<SignUp />} />
        
        <Route path="/home" element={<DashboardLayout />}>
          {/* Add nested routes */}
          {renderRoutes(dashboardRoutes)}
          {renderRoutes(inboxRoutes)}
          {renderRoutes(settingsRoutes)}
          {renderRoutes(automationRoutes)}
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
};

// Helper function to render routes from config
function renderRoutes(routes: any[]) {
  return routes.map((route) => {
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return <Route key={route.path} path={route.path} element={route.element} />;
  });
}

export default AppRoutes;
