
import { useEffect, useState } from 'react';
import { useChatWidget } from '@/context/ChatWidgetContext';

interface ChatWidgetConfig {
  workspaceId: string;
  theme?: any;
  labels?: any;
  features?: any;
}

export const useChatWidgetInitializer = (config?: ChatWidgetConfig) => {
  const { dispatch } = useChatWidget();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (config && !isInitialized) {
      dispatch({ 
        type: 'INITIALIZE', 
        payload: config 
      });
      setIsInitialized(true);
    }
  }, [config, dispatch, isInitialized]);
  
  return { isInitialized };
};
