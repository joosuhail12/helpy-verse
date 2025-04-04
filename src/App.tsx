
import React, { Suspense } from "react";
import AppProviders from "./components/app/AppProviders";
import AppRoutes from "./components/app/AppRoutes";
import DynamicImportErrorBoundary from "./components/common/DynamicImportErrorBoundary";
import LoadingSpinner from "./components/common/LoadingSpinner";

const App = () => {
  return (
    <React.StrictMode>
      <AppProviders>
        <DynamicImportErrorBoundary fallbackMessage="Failed to load application routes">
          <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
              <LoadingSpinner />
            </div>
          }>
            <AppRoutes />
          </Suspense>
        </DynamicImportErrorBoundary>
      </AppProviders>
    </React.StrictMode>
  );
};

export default App;
