
import React from "react";
import AppProviders from "./components/app/AppProviders";
import AppRoutes from "./components/app/AppRoutes";
import DynamicImportErrorBoundary from "./components/common/DynamicImportErrorBoundary";
import LoadingSpinner from "./components/common/LoadingSpinner";

const App = () => {
  return (
    <AppProviders>
      <DynamicImportErrorBoundary fallbackMessage="Failed to load application routes">
        <React.Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <LoadingSpinner />
          </div>
        }>
          <AppRoutes />
        </React.Suspense>
      </DynamicImportErrorBoundary>
    </AppProviders>
  );
};

export default App;
