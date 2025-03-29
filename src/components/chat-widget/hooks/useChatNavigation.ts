
/**
 * Hook for managing chat widget navigation
 */
import { useState } from 'react';
import { View } from '../types';

const useChatNavigation = () => {
  const [activeView, setActiveView] = useState<View>('home');
  
  const navigateToHome = () => setActiveView('home');
  const navigateToMessages = () => setActiveView('messages');
  const navigateToConversation = () => setActiveView('conversation');
  
  return {
    activeView,
    setActiveView,
    navigateToHome,
    navigateToMessages,
    navigateToConversation
  };
};

export default useChatNavigation;
