
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Suspense, lazy } from 'react';
import { useAppSelector } from "./hooks/useAppSelector";

const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Home = lazy(() => import("./pages/Dashboard"));
const AllTickets = lazy(() => import("./pages/inbox/All"));
const Tags = lazy(() => import("./pages/settings/Tags"));
const Teammates = lazy(() => import("./pages/settings/Teammates"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

const LoadingFallback = () => (
  <div className="min-h-screen w-full gradient-background flex items-center justify-center">
    <div className="w-full max-w-3xl p-6 md:p-8">
      <div className="auth-card opacity-40">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-primary/20 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-6 w-3/4 bg-primary/20 rounded-lg"></div>
            <div className="h-4 w-full bg-primary/20 rounded-lg"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-primary/20 rounded-lg"></div>
            <div className="h-4 w-5/6 bg-primary/20 rounded-lg"></div>
            <div className="h-4 w-4/6 bg-primary/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/home/*"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              >
                <Route path="inbox/all" element={<AllTickets />} />
                <Route path="settings/tags" element={<Tags />} />
                <Route path="settings/teammates" element={<Teammates />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
