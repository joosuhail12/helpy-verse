
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import WidgetHeader from './WidgetHeader';
import WidgetContent from './WidgetContent';
import WidgetLauncher from './WidgetLauncher';
import { ThemeProvider } from '../theme/ThemeContext';

interface ChatWidgetContainerProps {
  workspaceId?: string;
  theme?: any;
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
      <ThemeProvider customTheme={theme}>
        <div className={`fixed bottom-4 ${position === 'right' ? 'right-4' : 'left-4'} z-50`}>
          {showLauncher && !isOpen && (
            <WidgetLauncher onClick={toggleWidget} position={position} />
          )}
          
          {isOpen && (
            <div className="bg-white rounded-lg shadow-xl flex flex-col h-[550px] w-[360px] overflow-hidden border border-gray-200">
              <WidgetHeader onClose={toggleWidget} />
              <WidgetContent workspaceId={workspaceId} />
            </div>
          )}
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default ChatWidgetContainer;
