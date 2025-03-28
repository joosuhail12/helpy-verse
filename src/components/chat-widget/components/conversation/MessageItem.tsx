
import React, { useState } from 'react';
import { Check, CheckCheck, Smile, Paperclip } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage, FileAttachment } from './types';
import FileAttachmentItem from './FileAttachmentItem';
import UserAvatar from '../user/UserAvatar';

interface MessageItemProps {
  message: ChatMessage;
  showAvatar?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

const COMMON_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  showAvatar = false, 
  isFirstInGroup = true,
  isLastInGroup = true
}) => {
  const { colors } = useThemeContext();
  const { clientId } = useAbly();
  const [showReactions, setShowReactions] = useState(false);
  const isUserMessage = message.sender === 'user';
  
  const handleReaction = async (emoji: string) => {
    // This would be implemented with your realtime service
    console.log('Adding reaction', emoji, 'to message', message.id);
    // For now, we'll just toggle the reactions UI
    setShowReactions(false);
  };
  
  const getReadStatus = () => {
    if (!message.readBy || message.sender !== 'user') return null;
    
    if (message.readBy.length > 0) {
      return <CheckCheck size={14} className="ml-1 text-green-500" />;
    } else {
      return <Check size={14} className="ml-1 text-gray-400" />;
    }
  };

  // Adjust border radius based on position in group
  const getBorderRadius = () => {
    if (isUserMessage) {
      if (isFirstInGroup && isLastInGroup) return 'rounded-lg rounded-br-sm';
      if (isFirstInGroup) return 'rounded-lg rounded-br-sm rounded-tr-md';
      if (isLastInGroup) return 'rounded-lg rounded-br-sm rounded-tr-md';
      return 'rounded-lg rounded-tr-md rounded-br-md';
    } else {
      if (isFirstInGroup && isLastInGroup) return 'rounded-lg rounded-bl-sm';
      if (isFirstInGroup) return 'rounded-lg rounded-bl-sm rounded-tl-md';
      if (isLastInGroup) return 'rounded-lg rounded-bl-sm rounded-tl-md';
      return 'rounded-lg rounded-tl-md rounded-bl-md';
    }
  };

  // Adjust spacing based on position in group
  const getMarginClass = () => {
    if (isLastInGroup) return 'mb-1';
    return 'mb-0.5';
  };

  return (
    <div 
      className={`flex ${getMarginClass()} ${isUserMessage ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar for agent messages (left side) - only shown for last message in group */}
      {showAvatar && !isUserMessage && isLastInGroup && (
        <div className="mr-2 flex-shrink-0">
          <UserAvatar 
            name="Agent" 
            status="available" 
            size="sm"
          />
        </div>
      )}
      
      {/* Empty space for grouped messages without avatar */}
      {!showAvatar && !isUserMessage && isLastInGroup && (
        <div className="w-8 mr-2"></div>
      )}

      <div className={`flex flex-col ${isUserMessage ? 'items-end' : 'items-start'}`}>
        <div 
          className={`px-4 py-2 max-w-[85%] relative ${getBorderRadius()}`}
          style={{
            backgroundColor: isUserMessage ? colors.userMessage : colors.agentMessage,
            color: isUserMessage ? colors.userMessageText : colors.agentMessageText,
          }}
        >
          {message.content}
          
          {/* File attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment) => (
                <FileAttachmentItem key={attachment.id} attachment={attachment} />
              ))}
            </div>
          )}
          
          {/* Reaction button - only shown for the last message in a group */}
          {isLastInGroup && (
            <button 
              onClick={() => setShowReactions(!showReactions)}
              className="absolute -bottom-3 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
            >
              <Smile size={14} className="text-gray-500" />
            </button>
          )}
          
          {/* Reactions display */}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {Object.entries(message.reactions).map(([emoji, users]) => (
                <div key={emoji} className="bg-white rounded-full px-2 py-0.5 text-xs shadow-sm">
                  {emoji} {users.length}
                </div>
              ))}
            </div>
          )}
          
          {/* Reaction picker */}
          {showReactions && (
            <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-md p-2 z-10">
              <div className="flex gap-1">
                {COMMON_REACTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="hover:bg-gray-100 p-1 rounded"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Timestamp and read status - only shown for last message in group */}
        {isLastInGroup && (
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <span>
              {typeof message.timestamp === 'string' 
                ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            </span>
            {getReadStatus()}
          </div>
        )}
      </div>
      
      {/* Avatar for user messages (right side) - only shown for last message in group */}
      {showAvatar && isUserMessage && isLastInGroup && (
        <div className="ml-2 flex-shrink-0">
          <UserAvatar 
            name="You" 
            status="available" 
            size="sm"
          />
        </div>
      )}
      
      {/* Empty space for grouped messages without avatar */}
      {!showAvatar && isUserMessage && isLastInGroup && (
        <div className="w-8 ml-2"></div>
      )}
    </div>
  );
};

export default MessageItem;
