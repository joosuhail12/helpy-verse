
import React from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { View } from '../types';

interface HomeViewProps {
  workspaceId: string;
  onStartNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  setActiveView: (view: View) => void;
  onClose: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  onStartNewConversation,
  onSelectConversation,
  setActiveView,
  onClose
}) => {
  const { conversations } = useChat();
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header section */}
      <div className="p-6 pb-4">
        <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center mb-4">
          <div className="w-5 h-5 bg-black rounded-sm"></div>
        </div>
        <h2 className="text-lg text-gray-600 font-normal">Hello there.</h2>
        <h1 className="text-2xl font-semibold mt-1">How can we help?</h1>
      </div>
      
      {/* Content area */}
      <div className="flex-1 px-4 pb-4 space-y-4">
        {/* Recent Messages Section */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-medium mb-2">Recent Messages</h3>
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
            onClick={() => {
              onSelectConversation("customer-service-conv");
              setActiveView('conversation');
            }}
          >
            <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-black rounded-sm"></div>
            </div>
            <div className="flex-grow">
              <p className="text-black">can you explain copilot to me</p>
              <p className="text-gray-500 text-sm">Fin · 1d ago</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
        
        {/* Ask a question button */}
        <div 
          className="bg-white rounded-xl border p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
          onClick={onStartNewConversation}
        >
          <span className="font-medium">Ask a question</span>
          <div className="flex items-center">
            <div className="bg-black rounded-sm w-6 h-6 flex-shrink-0 mr-1"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Navigation footer */}
      <div className="border-t flex h-14">
        <button 
          className="flex-1 flex flex-col items-center justify-center text-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          onClick={() => setActiveView('messages')}
          className="flex-1 flex flex-col items-center justify-center text-gray-500" 
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="text-xs mt-1">Messages</span>
        </button>
      </div>
    </div>
  );
};

export default HomeView;
