
import React, { createContext, useContext, ReactNode } from 'react';

interface AblyContextType {
  workspaceId: string;
  isConnected: boolean;
  lastConnected: string | null;
}

const defaultContext: AblyContextType = {
  workspaceId: 'workspace-123',
  isConnected: false,
  lastConnected: null,
};

const AblyContext = createContext<AblyContextType>(defaultContext);

export const AblyProvider: React.FC<{ children: ReactNode; workspaceId: string }> = ({ 
  children,
  workspaceId
}) => {
  return (
    <AblyContext.Provider value={{
      workspaceId,
      isConnected: true,
      lastConnected: new Date().toISOString()
    }}>
      {children}
    </AblyContext.Provider>
  );
};

export const useAbly = () => useContext(AblyContext);
