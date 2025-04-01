
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AblyContextState {
  clientId: string;
  workspaceId: string;
  isConnected: boolean;
}

const AblyContext = createContext<AblyContextState | undefined>(undefined);

interface AblyProviderProps {
  children: React.ReactNode;
  workspaceId: string;
}

export const AblyProvider: React.FC<AblyProviderProps> = ({ children, workspaceId }) => {
  const [state, setState] = useState<AblyContextState>({
    clientId: `user-${Math.random().toString(36).substring(2, 9)}`,
    workspaceId,
    isConnected: false
  });

  useEffect(() => {
    // Mock connection to Ably
    const timeout = setTimeout(() => {
      setState(prev => ({ ...prev, isConnected: true }));
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AblyContext.Provider value={state}>
      {children}
    </AblyContext.Provider>
  );
};

export const useAbly = (): AblyContextState => {
  const context = useContext(AblyContext);
  
  if (context === undefined) {
    throw new Error('useAbly must be used within an AblyProvider');
  }
  
  return context;
};
