
import React from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';

const ChatWidgetPreview: React.FC = () => {
  const { colors, position, compact, labels } = useThemeContext();

  // Sample messages for the preview
  const messages = [
    { 
      id: '1', 
      content: 'Hello! How can I help you today?', 
      sender: 'agent',
      timestamp: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: '2',
      content: 'I have a question about your services.',
      sender: 'user',
      timestamp: new Date(Date.now() - 500000).toISOString(),
    },
    {
      id: '3',
      content: "I'd be happy to help with that. What would you like to know specifically?",
      sender: 'agent',
      timestamp: new Date(Date.now() - 400000).toISOString(),
    }
  ];

  return (
    <div className="h-full flex flex-col relative">
      {/* Widget Button */}
      <div 
        className={`absolute ${position === 'right' ? 'right-4' : 'left-4'} bottom-4 shadow-lg rounded-full p-3`}
        style={{ backgroundColor: colors.primary }}
      >
        <MessageCircle size={24} style={{ color: colors.primaryForeground }} />
      </div>

      {/* Widget Panel */}
      <div 
        className={`absolute ${position === 'right' ? 'right-4' : 'left-4'} bottom-20 shadow-lg rounded-lg overflow-hidden flex flex-col`}
        style={{ 
          backgroundColor: colors.background,
          width: compact ? '300px' : '380px',
          height: '500px',
        }}
      >
        {/* Widget Header */}
        <div 
          className="p-4 flex items-center gap-3"
          style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
        >
          <MessageCircle />
          <div>
            <h3 className="font-medium">{labels.welcomeTitle}</h3>
            <p className="text-sm opacity-90">{labels.welcomeSubtitle}</p>
          </div>
        </div>

        {/* Widget Messages */}
        <div 
          className="flex-1 overflow-y-auto p-4" 
          style={{ color: colors.foreground }}
        >
          <div className="space-y-4">
            {messages.map(message => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className="max-w-[80%] rounded-lg px-4 py-2"
                  style={{ 
                    backgroundColor: message.sender === 'user' ? colors.userMessage : colors.agentMessage,
                    color: message.sender === 'user' ? colors.userMessageText : colors.agentMessageText,
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget Input */}
        <div 
          className="p-3 border-t flex gap-2"
          style={{ borderColor: colors.border }}
        >
          <input 
            type="text" 
            placeholder={labels.messagePlaceholder || "Type a message..."} 
            className="flex-1 px-3 py-2 rounded-md text-sm"
            style={{ 
              backgroundColor: colors.inputBackground,
              color: colors.foreground,
              border: `1px solid ${colors.border}`
            }}
          />
          <Button 
            size="icon" 
            style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidgetPreview;
