
import React from 'react';
import { Message } from '../types';
import { useTheme } from '../../../theme/ThemeContext';
import { Check, CheckCheck } from 'lucide-react';

interface EnhancedMessageItemProps {
  message: Message;
  formatTimestamp: (timestamp: string) => string;
  isRead?: boolean;
}

/**
 * Enhanced component to render an individual message with additional features
 */
const EnhancedMessageItem: React.FC<EnhancedMessageItemProps> = ({ 
  message, 
  formatTimestamp,
  isRead = false
}) => {
  const isUserMessage = message.sender === 'user';
  const { theme } = useTheme();
  
  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          isUserMessage 
            ? 'text-white rounded-br-none' 
            : 'text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
        }`}
        style={{
          backgroundColor: isUserMessage ? theme.colors.primary : theme.colors.background,
          color: isUserMessage ? theme.colors.headerText : theme.colors.text,
        }}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        <div className="flex justify-end items-center mt-1 space-x-1">
          <span className={`text-xs ${
            isUserMessage ? 'text-gray-300' : 'text-gray-400'
          }`}>
            {formatTimestamp(message.timestamp)}
          </span>
          
          {isUserMessage && (
            <span className="text-xs ml-1">
              {isRead ? 
                <CheckCheck className="h-3 w-3 text-gray-300" /> : 
                <Check className="h-3 w-3 text-gray-300" />
              }
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessageItem;
