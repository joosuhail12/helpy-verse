
import React, { ReactNode, useEffect } from 'react';

interface AppInitializerProps {
  children: ReactNode;
}

// Initialize the application
export const initializeApp = () => {
  console.log("Initializing app...");
  
  // Set up any global event listeners or configurations here
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
  });
  
  // Initialize any required services
  console.log("App initialization complete");
};

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  useEffect(() => {
    // Run any component-specific initialization if needed
    console.log("AppInitializer component mounted");
  }, []);

  return <>{children}</>;
};

export default AppInitializer;
