
import React from "react";
import AppProviders from "./components/app/AppProviders";
import AppRoutes from "./components/app/AppRoutes";

const App: React.FC = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;
