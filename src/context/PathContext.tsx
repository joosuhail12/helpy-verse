
import React, { createContext, useContext, ReactNode } from 'react';

interface PathContextProps {
  base: string;
}

const PathContext = createContext<PathContextProps | undefined>(undefined);

/**
 * Provider component for path context
 */
export const PathProvider: React.FC<PathContextProps & { children: ReactNode }> = ({ 
  base, 
  children 
}) => {
  return (
    <PathContext.Provider value={{ base }}>
      {children}
    </PathContext.Provider>
  );
};

/**
 * Hook for using path context
 */
export const usePath = () => {
  const context = useContext(PathContext);
  if (!context) {
    throw new Error('usePath must be used within a PathProvider');
  }
  return context;
};
