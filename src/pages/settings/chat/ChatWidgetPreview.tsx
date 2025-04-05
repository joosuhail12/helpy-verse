
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { ChevronRight, MessageSquare, Send, Paperclip, Smile } from 'lucide-react';
import { mockMessages } from '@/mock/chatMessages';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';

const ChatWidgetPreview = () => {
  const { 
    colors, 
    position, 
    compact, 
    labels,
    logo,
    launcherIcon,
    positionOffset 
  } = useThemeContext();
  
  // Show only the 5 most recent messages in reverse chronological order
  const messages = [...mockMessages].reverse().slice(0, 5);
  
  return (
    <div className="relative h-full">
      {/* Chat launcher button */}
      <div 
        className="absolute z-10 rounded-full shadow-lg cursor-pointer"
        style={{ 
          backgroundColor: colors.primary,
          bottom: `${20 + positionOffset.y}px`,
          ...(position === 'right' 
            ? { right: `${20 + positionOffset.x}px` } 
            : { left: `${20 + positionOffset.x}px` }),
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {launcherIcon ? (
          <img 
            src={launcherIcon} 
            alt="Chat launcher" 
            className="w-8 h-8 object-contain"
          />
        ) : (
          <MessageSquare className="text-white h-6 w-6" />
        )}
      </div>
      
      {/* Chat widget */}
      <div 
        className="absolute rounded-lg shadow-xl overflow-hidden flex flex-col"
        style={{ 
          backgroundColor: colors.background,
          bottom: `${90 + positionOffset.y}px`,
          ...(position === 'right' 
            ? { right: `${20 + positionOffset.x}px` } 
            : { left: `${20 + positionOffset.x}px` }),
          width: compact ? '300px' : '375px',
          height: '500px',
        }}
      >
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between"
          style={{ backgroundColor: colors.primary }}
        >
          <div className="flex items-center">
            {logo ? (
              <img 
                src={logo} 
                alt="Company logo" 
                className="h-8 mr-2 object-contain"
              />
            ) : null}
            <div>
              <h3 
                className="font-medium"
                style={{ color: '#ffffff' }}
              >
                {labels.welcomeTitle || 'Chat Support'}
              </h3>
              <p 
                className="text-xs"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                {labels.welcomeSubtitle || 'We\'re here to help'}
              </p>
            </div>
          </div>
          <button className="text-white hover:bg-white/10 rounded p-1">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* Chat messages */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ color: colors.foreground }}
        >
          {messages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isUser && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Agent" />
                </Avatar>
              )}
              <div
                className="rounded-lg px-3 py-2 max-w-[80%]"
                style={{ 
                  backgroundColor: message.isUser ? colors.userMessage : colors.agentMessage,
                  color: colors.foreground
                }}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 block mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Input area */}
        <div className="border-t p-3 flex">
          <div 
            className="flex-1 rounded-l-lg border px-3 py-2 flex items-center"
            style={{ backgroundColor: 'white', borderColor: 'rgba(0,0,0,0.1)' }}
          >
            <input 
              type="text" 
              placeholder="Type your message..."
              className="flex-1 outline-none text-sm bg-transparent"
              style={{ color: colors.foreground }}
            />
            <div className="flex items-center">
              <button className="p-1 hover:bg-gray-100 rounded mr-1">
                <Paperclip className="h-4 w-4 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Smile className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          <button 
            className="rounded-r-lg px-3 flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidgetPreview;
