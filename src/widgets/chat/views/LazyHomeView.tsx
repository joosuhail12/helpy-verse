
import React from 'react';

interface LazyHomeViewProps {
  onStartConversation: (message: string) => void;
  onViewMessages: () => void;
  onClose: () => void;
}

const LazyHomeView: React.FC<LazyHomeViewProps> = ({
  onStartConversation,
  onViewMessages,
  onClose
}) => {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Chat Support</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2">Welcome to Chat Support</h3>
        <p className="text-muted-foreground mb-6">How can we help you today?</p>
        
        <div className="w-full space-y-3">
          <button 
            onClick={() => onStartConversation("I need help with my account")}
            className="w-full py-2 px-4 bg-background border rounded-md hover:bg-gray-50 text-left"
          >
            I need help with my account
          </button>
          <button 
            onClick={() => onStartConversation("I have a billing question")}
            className="w-full py-2 px-4 bg-background border rounded-md hover:bg-gray-50 text-left"
          >
            I have a billing question
          </button>
          <button 
            onClick={() => onStartConversation("I want to report an issue")}
            className="w-full py-2 px-4 bg-background border rounded-md hover:bg-gray-50 text-left"
          >
            I want to report an issue
          </button>
        </div>
      </div>
      
      <button 
        onClick={onViewMessages}
        className="w-full py-2 mt-4 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        View Previous Conversations
      </button>
    </div>
  );
};

export default LazyHomeView;
