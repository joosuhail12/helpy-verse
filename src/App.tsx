
import React from 'react';
import AppProviders from './components/app/AppProviders';
import AppRoutes from './components/app/AppRoutes';
import './App.css';

// Main App component
function App() {
  console.log("App component rendering");
  
  // Ensure React is properly initialized
  if (!React) {
    console.error("React is not available in the global scope");
    return <div>Critical Error: React framework not loaded correctly</div>;
  }
  
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
