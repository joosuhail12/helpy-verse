
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { X, ChevronLeft } from 'lucide-react';

interface ChatWidgetContainerProps {
  onClose: () => void;
  workspaceId: string;
  position?: 'left' | 'right';
  compact?: boolean;
  instanceId?: string;
}

const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({
  onClose,
  workspaceId,
  position = 'right',
  compact = false,
  instanceId = 'default'
}) => {
  const { colors, labels } = useThemeContext();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
            <span className="text-white text-sm">P</span>
          </div>
          <div>
            <h2 className="font-medium">{labels?.welcomeTitle || 'Hello there'}</h2>
            <p className="text-sm text-gray-500">{labels?.welcomeSubtitle || 'How can we help?'}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label="Close chat"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-center py-8">
          <p className="text-gray-500">Welcome to our chat widget!</p>
          <p className="text-gray-500 mt-2">Ask us anything or browse through your recent conversations.</p>
        </div>
      </div>

      {/* Footer with input */}
      <div 
        className="border-t p-3"
        style={{ borderColor: colors.border }}
      >
        <div className="flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none"
            style={{ 
              borderColor: colors.border,
              backgroundColor: colors.inputBackground || '#F9F9F9' 
            }}
          />
          <button
            className="px-4 py-2 bg-primary text-white rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidgetContainer;
