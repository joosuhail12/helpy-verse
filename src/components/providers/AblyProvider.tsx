
import React, { useEffect, useState } from 'react';
import { configureAbly } from '@ably-labs/react-hooks';
import { Realtime } from 'ably';

interface AblyProviderProps {
  children: React.ReactNode;
}

const AblyProvider: React.FC<AblyProviderProps> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  
  useEffect(() => {
    try {
      // Get the Ably API key from environment variables
      const ablyApiKey = import.meta.env.VITE_ABLY_API_KEY || '';
      
      if (ablyApiKey) {
        // Configure Ably with the API key
        const ably = configureAbly({ key: ablyApiKey });
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

  if (!isConfigured) {
    return null; // Or a loading state
  }

  return <>{children}</>;
};

export default AblyProvider;
