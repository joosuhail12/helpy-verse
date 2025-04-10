
import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import AppProviders from "./components/app/AppProviders";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { Toaster } from "./components/ui/toaster";

/**
 * Root application component that initializes the app and provides
 * top-level error handling with fallbacks
 */
const App: React.FC = () => {
  console.log("App component rendering with router");
  
  return (
    <ErrorBoundary>
      <React.Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-2 text-lg">Loading application...</span>
        </div>
      }>
        <AppProviders>
          <RouterProvider router={router} />
          <Toaster />
        </AppProviders>
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default App;
