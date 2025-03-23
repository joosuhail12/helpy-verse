
import React, { useEffect, useState } from 'react';
import { configureAbly } from '@ably-labs/react-hooks';
import { AblyProvider as AblyReactHooksProvider } from '@ably-labs/react-hooks';

interface AblyProviderProps {
  children: React.ReactNode;
}

const AblyProvider: React.FC<AblyProviderProps> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [ablyClient, setAblyClient] = useState<any>(null);
  
  useEffect(() => {
    try {
      // Get the Ably API key from environment variables
      const ablyApiKey = import.meta.env.VITE_ABLY_API_KEY || '';
      
      if (ablyApiKey) {
        // Configure Ably with the API key
        const client = configureAbly({ key: ablyApiKey });
        setAblyClient(client);
        console.log('Ably configured successfully');
        setIsConfigured(true);
      } else {
        console.warn('Ably API key not found. Real-time functionality will be limited.');
        // Still set as configured to avoid blocking rendering
        setIsConfigured(true);
      }
    } catch (error) {
      console.error('Error configuring Ably:', error);
      // Still set as configured to avoid blocking rendering
      setIsConfigured(true);
    }
  }, []);

  if (!isConfigured || !ablyClient) {
    return <>{children}</>; // Render children without Ably context if not configured
  }

  return (
    <AblyReactHooksProvider client={ablyClient}>
      {children}
    </AblyReactHooksProvider>
  );
};

export default AblyProvider;
