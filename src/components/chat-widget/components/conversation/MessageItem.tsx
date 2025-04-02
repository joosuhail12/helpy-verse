
import React, { useState } from 'react';
import { Check, CheckCheck, Smile, Paperclip } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage, FileAttachment } from './types';
import FileAttachmentItem from './FileAttachmentItem';

interface MessageItemProps {
  message: ChatMessage;
}

const COMMON_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
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

  return (
    <div 
      className={`flex flex-col mb-4 ${isUserMessage ? 'items-end' : 'items-start'}`}
    >
      <div 
        className={`px-4 py-2 rounded-lg max-w-[85%] relative ${
          isUserMessage 
            ? 'bg-primary text-white' 
            : 'bg-gray-200'
        }`}
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
        
        {/* Reaction button */}
        <button 
          onClick={() => setShowReactions(!showReactions)}
          className="absolute -bottom-3 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
        >
          <Smile size={14} className="text-gray-500" />
        </button>
        
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
      
      <div className="flex items-center mt-1 text-xs text-gray-500">
        <span>
          {typeof message.timestamp === 'string' 
            ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        </span>
        {getReadStatus()}
      </div>
    </div>
  );
};

export default MessageItem;
