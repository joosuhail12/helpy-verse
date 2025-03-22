
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import WidgetHeader from './WidgetHeader';
import WidgetContent from './WidgetContent';
import WidgetLauncher from './WidgetLauncher';
import { ThemeProvider, ThemeConfig } from '../theme/ThemeContext';
import ChatWidgetErrorBoundary from '../ChatWidgetErrorBoundary';
import AnimatedContainer from '../animations/AnimatedContainer';

interface ChatWidgetContainerProps {
  workspaceId?: string;
  theme?: Partial<ThemeConfig>;
  position?: 'right' | 'left';
  showLauncher?: boolean;
}

/**
 * Container for the chat widget with provider setup
 */
const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({
  workspaceId,
  theme,
  position = 'right',
  showLauncher = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleWidget = () => {
    setIsOpen(prev => !prev);
  };
  
  return (
    <Provider store={store}>
      <ThemeProvider initialTheme={theme}>
        <ChatWidgetErrorBoundary>
          <div className={`fixed bottom-4 ${position === 'right' ? 'right-4' : 'left-4'} z-50`}>
            {showLauncher && !isOpen && (
              <AnimatedContainer animation="scaleIn">
                <WidgetLauncher toggleWidget={toggleWidget} position={position} />
              </AnimatedContainer>
            )}
            
            {isOpen && (
              <AnimatedContainer 
                animation="fadeIn" 
                className="bg-white rounded-lg shadow-xl flex flex-col h-[550px] w-[360px] overflow-hidden border border-gray-200"
                style={{ boxShadow: theme?.shadows?.widget }}
              >
                <WidgetHeader 
                  currentPage="home" 
                  navigateTo={() => {}} 
                  toggleWidget={toggleWidget} 
                />
                <WidgetContent 
                  currentPage="home"
                  currentConversationId={null}
                  navigateTo={() => {}}
                  handleSelectConversation={() => {}}
                  handleConversationCreated={() => {}}
                  workspaceId={workspaceId}
                />
              </AnimatedContainer>
            )}
          </div>
        </ChatWidgetErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
};

export default ChatWidgetContainer;
