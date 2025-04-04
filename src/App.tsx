
import * as React from "react";
import { Suspense, useEffect } from "react";
import AppProviders from "./components/app/AppProviders";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Loader2 } from 'lucide-react';
import ErrorBoundary from "./components/common/ErrorBoundary";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
    <span className="ml-2 text-lg">Loading application...</span>
  </div>
);

/**
 * Root application component that initializes the app and provides
 * top-level error handling with fallbacks
 */
const App: React.FC = () => {
  console.log("App component rendering");
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
