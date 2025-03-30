
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';

interface ChatWidgetContainerProps {
  onClose: () => void;
  workspaceId: string;
  position: 'left' | 'right';
  compact?: boolean;
  instanceId?: string;
}

const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({
  onClose,
  workspaceId,
  position,
  compact = false,
  instanceId = 'default'
}) => {
  const { colors, labels } = useThemeContext();
  
  // Handle message sent events, propagating them to parent with instance ID
  const handleMessageSent = (content: string) => {
    window.dispatchEvent(new CustomEvent(`chat-message-sent-${instanceId}`, {
      detail: {
        message: { content }
      }
    }));
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-primary text-white flex justify-between items-center">
        <h3 className="font-medium">{labels?.welcomeTitle || 'Chat Support'}</h3>
        <button onClick={onClose} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-background">
        <div className="mb-4 text-center p-3">
          <p className="text-sm text-gray-600">{labels?.welcomeSubtitle || 'How can we help you today?'}</p>
        </div>
        
        {/* Chat messages would be displayed here */}
        <div className="space-y-4">
          <div className="bg-agentMessage rounded-lg p-3 max-w-[80%]">
            <p className="text-sm text-agentMessageText">Hello! How can I assist you today?</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t bg-white">
        <div className="flex">
          <input 
            type="text" 
            placeholder={labels?.placeholder || "Type a message..."}
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleMessageSent((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
          <button 
            className="px-4 py-2 bg-primary text-white rounded-r-md"
            onClick={() => {
              const input = document.querySelector('input') as HTMLInputElement;
              if (input && input.value) {
                handleMessageSent(input.value);
                input.value = '';
              }
            }}
          >
            {labels?.sendButton || "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidgetContainer;
