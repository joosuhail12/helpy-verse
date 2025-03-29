
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import chatWidgetApi from '@/api/chat-widget';
import type { ChatMessage, FileAttachment } from '@/api/chat-widget/types';

/**
 * Demo component showing how to use the Chat Widget API
 */
const ChatWidgetDemo: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  
  // Initialize chat widget on mount
  useEffect(() => {
    const initializeWidget = async () => {
      const success = await chatWidgetApi.initialize({
        workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
        theme: {
          colors: {
            primary: '#4f46e5'
          }
        },
        events: {
          onMessageReceived: (message) => {
            console.log('Message received:', message);
            setMessages(prev => [...prev, message]);
          }
        }
      });
      
      if (success) {
        setInitialized(true);
        loadMessages();
      }
    };
    
    initializeWidget();
    
    return () => {
      // Clean up attachments on unmount
      attachments.forEach(attachment => {
        if (attachment.url.startsWith('blob:')) {
          URL.revokeObjectURL(attachment.url);
        }
      });
    };
  }, []);
  
  // Load messages
  const loadMessages = async () => {
    const loadedMessages = await chatWidgetApi.getMessages();
    setMessages(loadedMessages);
  };
  
  // Handle sending messages
  const handleSendMessage = async () => {
    if (!messageText.trim() && attachments.length === 0) return;
    
    // Send message
    const message = await chatWidgetApi.sendMessage(
      messageText,
      attachments.map(a => a.url),
      { demo: true }
    );
    
    if (message) {
      setMessages(prev => [...prev, message]);
      setMessageText('');
      setAttachments([]);
    }
  };
  
  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      newFiles.forEach(file => {
        const attachment = chatWidgetApi.addAttachment(file);
        if (attachment) {
          setAttachments(prev => [...prev, attachment]);
        }
      });
    }
  };
  
  // Remove attachment
  const handleRemoveAttachment = (id: string) => {
    chatWidgetApi.removeAttachment(id);
    setAttachments(prev => prev.filter(a => a.id !== id));
  };
  
  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Chat Widget API Demo</h2>
      
      <div className="space-y-2 mb-4">
        <Button onClick={() => chatWidgetApi.toggleWidget()}>
          Toggle Widget
        </Button>
        <span className="ml-2">
          Status: {initialized ? 'Initialized' : 'Not initialized'}
        </span>
      </div>
      
      <div className="border rounded-md p-3 h-60 overflow-y-auto mb-4">
        {messages.map(message => (
          <div key={message.id} className={`mb-2 p-2 rounded ${
            message.sender === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
          }`}>
            <div className="text-sm font-medium">
              {message.sender === 'user' ? 'You' : 'Agent'}
            </div>
            <div>{message.content}</div>
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-1 text-xs text-gray-500">
                {message.attachments.length} attachment(s)
              </div>
            )}
          </div>
        ))}
      </div>
      
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map(attachment => (
            <div key={attachment.id} className="border rounded p-1 text-xs flex items-center">
              {attachment.name}
              <button 
                className="ml-1 text-red-500" 
                onClick={() => handleRemoveAttachment(attachment.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <Textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          rows={3}
        />
        <div className="space-y-2">
          <Button 
            type="button" 
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            +
          </Button>
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
      
      <input
        id="file-upload"
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ChatWidgetDemo;
