
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Suspense, lazy } from 'react';
import { useAppSelector } from "./hooks/useAppSelector";

// Lazy load components with explicit chunk names
const SignIn = lazy(() => import(/* webpackChunkName: "signin" */ "./pages/SignIn"));
const SignUp = lazy(() => import(/* webpackChunkName: "signup" */ "./pages/SignUp"));
const ForgotPassword = lazy(() => import(/* webpackChunkName: "forgot-password" */ "./pages/ForgotPassword"));
const Home = lazy(() => import(/* webpackChunkName: "home" */ "./pages/Dashboard"));
const AllTickets = lazy(() => import(/* webpackChunkName: "all-tickets" */ "./pages/inbox/All"));
const Tags = lazy(() => import(/* webpackChunkName: "tags" */ "./pages/settings/Tags"));
const Teammates = lazy(() => 
  import(/* webpackChunkName: "teammates" */ "./pages/settings/Teammates")
    .catch(error => {
      console.error("Error loading Teammates component:", error);
      return { default: () => <div>Error loading teammates page. Please try refreshing.</div> };
    })
);
const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ "./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
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
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;

