
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
          {conversations.length > 0 ? (
            conversations.slice(0, 1).map(conversation => (
              <div 
                key={conversation.id}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                onClick={() => {
                  onSelectConversation(conversation.id);
                  setActiveView('conversation');
                }}
              >
                <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 bg-black rounded-sm"></div>
                </div>
                <div className="flex-grow">
                  <p className="text-black truncate">{conversation.lastMessage || "No messages yet"}</p>
                  <p className="text-gray-500 text-sm">
                    {conversation.title?.split(' ')[0] || "User"} · {' '}
                    {typeof conversation.lastMessageTimestamp === 'string' 
                      ? conversation.lastMessageTimestamp
                      : '1d ago'}
                  </p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            ))
          ) : (
            <div className="flex items-center space-x-3 p-2 rounded-lg">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 bg-black rounded-sm"></div>
              </div>
              <div className="flex-grow">
                <p className="text-black">No messages yet</p>
                <p className="text-gray-500 text-sm">New · 1d ago</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          )}
        </div>
        
        {/* Ask a question button */}
        <div 
          className="bg-white rounded-xl border p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
          onClick={() => setActiveView('messages')}
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
    </div>
  );
};

export default HomeView;
