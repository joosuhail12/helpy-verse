
import React from 'react';
import { X, ArrowLeft, Home, MessageSquare, List } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

interface SampleConversationProps {
  onClose: () => void;
  position?: 'left' | 'right';
  compact?: boolean;
  headerTitle?: string;
  headerColor?: string;
  currentView?: 'home' | 'messages' | 'conversation';
  onChangeView?: (view: 'home' | 'messages' | 'conversation') => void;
  userMessageColor?: string;
  agentMessageColor?: string;
  messageBoxColor?: string;
}

const SampleConversation: React.FC<SampleConversationProps> = ({
  onClose,
  position = 'right',
  compact = false,
  headerTitle = 'Chat with us',
  headerColor = '#9b87f5',
  currentView = 'conversation',
  onChangeView,
  userMessageColor = '#9b87f5',
  agentMessageColor = '#f1f1f1',
  messageBoxColor = '#f9f9f9',
}) => {
  const { colors } = useThemeContext();

  const renderHomeView = () => (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="text-center mb-6 mt-4">
        <h3 className="text-xl font-semibold mb-2">How can we help?</h3>
        <p className="text-gray-500 text-sm">We're here to answer your questions.</p>
      </div>
      
      <button 
        className="w-full p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition mb-3 text-left"
        onClick={() => onChangeView && onChangeView('conversation')}
      >
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-gray-500" />
          <span>Ask a question</span>
        </div>
      </button>
      
      <div className="mt-6">
        <h4 className="font-medium text-sm mb-3">Recent conversations</h4>
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No recent conversations</p>
        </div>
      </div>
    </div>
  );
  
  const renderMessagesView = () => (
    <div className="flex-1 p-4 overflow-y-auto">
      <h3 className="font-medium mb-3">Your conversations</h3>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => onChangeView && onChangeView('conversation')}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition"
          >
            <h4 className="font-medium">Conversation {i}</h4>
            <p className="text-sm text-gray-500 truncate">
              {i === 1 ? "Thanks for your help!" : `Last message from conversation ${i}`}
            </p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-400">
                {new Date().toLocaleDateString()}
              </span>
              {i === 1 && (
                <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5"
                  style={{ backgroundColor: colors?.primary || headerColor }}>
                  New
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
  
  const renderConversationView = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="flex justify-start">
          <div className="bg-gray-200 rounded-lg py-2 px-3 max-w-[80%]" 
               style={{ backgroundColor: agentMessageColor }}>
            <p>Hi there! How can I help you today?</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="rounded-lg py-2 px-3 max-w-[80%] text-white" 
               style={{ backgroundColor: userMessageColor }}>
            <p>I'm looking for information about your pricing plans.</p>
          </div>
        </div>
        
        <div className="flex justify-start">
          <div className="bg-gray-200 rounded-lg py-2 px-3 max-w-[80%]" 
               style={{ backgroundColor: agentMessageColor }}>
            <p>Our pricing plans start at $10/month for the basic plan, which includes all essential features. The pro plan is $25/month and includes advanced analytics and priority support.</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="rounded-lg py-2 px-3 max-w-[80%] text-white" 
               style={{ backgroundColor: userMessageColor }}>
            <p>Thanks! Do you offer a free trial?</p>
          </div>
        </div>
        
        <div className="flex justify-start">
          <div className="bg-gray-200 rounded-lg py-2 px-3 max-w-[80%]" 
               style={{ backgroundColor: agentMessageColor }}>
            <p>Yes, we offer a 14-day free trial for all plans. No credit card required until you decide to continue.</p>
          </div>
        </div>
      </div>
      
      <div className="p-3 border-t">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="w-full p-3 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            style={{ backgroundColor: messageBoxColor }}
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary"
                 style={{ color: colors?.primary || headerColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white text-gray-900 w-full rounded-lg overflow-hidden shadow-lg">
      <header 
        className="p-4 text-white flex items-center justify-between" 
        style={{ backgroundColor: headerColor }}
      >
        {currentView === 'conversation' && onChangeView ? (
          <button 
            onClick={() => onChangeView('messages')} 
            className="text-white p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="w-5" /> 
        )}
        
        <h2 className="font-semibold text-center flex-1">{headerTitle}</h2>
        
        <button 
          onClick={onClose} 
          className="text-white p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </header>
      
      {currentView === 'home' && renderHomeView()}
      {currentView === 'messages' && renderMessagesView()}
      {currentView === 'conversation' && renderConversationView()}

      {/* Navigation Footer */}
      {onChangeView && (
        <div className="border-t border-gray-200 p-2 flex justify-around">
          <button 
            className={`p-2 rounded-md ${currentView === 'home' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:bg-gray-100'}`} 
            style={{ color: currentView === 'home' ? (colors?.primary || headerColor) : '' }}
            onClick={() => onChangeView('home')}
          >
            <Home className="h-5 w-5" />
          </button>
          <button 
            className={`p-2 rounded-md ${currentView === 'messages' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:bg-gray-100'}`}
            style={{ color: currentView === 'messages' ? (colors?.primary || headerColor) : '' }}
            onClick={() => onChangeView('messages')}
          >
            <List className="h-5 w-5" />
          </button>
          <button 
            className={`p-2 rounded-md ${currentView === 'conversation' ? 'text-primary bg-primary/10' : 'text-gray-500 hover:bg-gray-100'}`}
            style={{ color: currentView === 'conversation' ? (colors?.primary || headerColor) : '' }}
            onClick={() => onChangeView('conversation')}
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SampleConversation;
