
import React from "react";
import AppProviders from "./components/app/AppProviders";
import AppRoutes from "./components/app/AppRoutes";
import "./index.css";

// Verify React is available
if (!React) {
  console.error("React is not properly initialized in App.tsx");
}

const App: React.FC = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
