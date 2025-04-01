
/**
 * Hook for managing chat widget state
 */
import { useContext } from 'react';
import { ChatWidgetContext } from '@/context/ChatWidgetContext';

export const useChatWidget = () => {
  const context = useContext(ChatWidgetContext);
  
  if (!context) {
    throw new Error('useChatWidget must be used within a ChatWidgetProvider');
  }
  
  return context;
};
