
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import ConnectedChatWidget from './ConnectedChatWidget';
import { useAppSelector } from '@/hooks/redux';
import { selectChatWidgetSettings } from '@/store/slices/chatWidgetSettings/selectors';

/**
 * Standalone chat widget component that can be embedded on any website
 */
const ChatWidgetStandalone: React.FC<{
  workspaceId: string;
}> = ({ workspaceId }) => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const settings = useAppSelector(selectChatWidgetSettings);
  
  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    
    // Set default theme
    if (!theme) setTheme('light');
    
    // Listen for external toggle events
    const handleToggleEvent = (event: CustomEvent) => {
      const { open, toggle } = event.detail;
      
      if (typeof open === 'boolean') {
        setIsOpen(open);
      } else if (toggle) {
        setIsOpen(prev => !prev);
      }
    };
    
    window.addEventListener('pullse-chat-toggle', handleToggleEvent as EventListener);
    
    // Cleanup function
    return () => {
      setMounted(false);
      window.removeEventListener('pullse-chat-toggle', handleToggleEvent as EventListener);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="pullse-chat-standalone-container">
      <ConnectedChatWidget 
        workspaceId={workspaceId} 
        isOpen={isOpen}
        onToggle={() => setIsOpen(prev => !prev)}
      />
    </div>
  );
};

export default ChatWidgetStandalone;
