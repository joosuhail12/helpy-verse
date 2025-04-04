
import * as React from "react";
import AppProviders from "./components/app/AppProviders";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const App: React.FC = () => {
  console.log("App component rendering with router");
  
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};

export default App;
