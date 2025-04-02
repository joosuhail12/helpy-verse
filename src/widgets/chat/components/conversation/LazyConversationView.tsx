
import React from 'react';
import { useChat } from '@/hooks/chat/useChat';

interface LazyConversationViewProps {
  workspaceId: string;
  onBack: () => void;
  onClose: () => void;
}

const LazyConversationView: React.FC<LazyConversationViewProps> = ({
  workspaceId,
  onBack,
  onClose
}) => {
  const { currentConversation } = useChat();
  
  if (!currentConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-muted-foreground">No conversation selected</p>
        <button 
          onClick={onBack}
          className="mt-4 py-2 px-4 bg-primary text-white rounded-md"
        >
          Back to Conversations
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="p-1 mr-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold">{currentConversation.title}</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-4">
          {/* This would display actual messages */}
          <div className="self-start max-w-[80%] bg-gray-100 p-3 rounded-lg">
            <p>Hello! How can I help you today?</p>
          </div>
          
          <div className="self-end max-w-[80%] bg-primary text-white p-3 rounded-lg">
            <p>I'm having trouble with my account.</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md"
          />
          <button className="p-2 bg-primary text-white rounded-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LazyConversationView;
