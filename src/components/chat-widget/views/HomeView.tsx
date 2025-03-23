
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useChat } from '@/hooks/chat/useChat';

interface HomeViewProps {
  workspaceId: string;
  onClose: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ workspaceId }) => {
  const { createNewConversation } = useChat();

  const handleAskQuestion = async () => {
    const conversationId = await createNewConversation("New question");
    console.log("Created new conversation:", conversationId);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header with logo */}
      <div className="pt-6 pb-4 px-6 text-white">
        <div className="bg-white/10 w-10 h-10 rounded-md flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="8" y1="7" x2="16" y2="7" stroke="black" strokeWidth="2" />
            <line x1="8" y1="12" x2="16" y2="12" stroke="black" strokeWidth="2" />
            <line x1="8" y1="17" x2="16" y2="17" stroke="black" strokeWidth="2" />
          </svg>
        </div>
        <h1 className="text-2xl text-gray-400 font-light mb-1">Hello there.</h1>
        <h2 className="text-3xl font-medium">How can we help?</h2>
      </div>

      {/* Content area */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto space-y-4">
        {/* Recent message */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-medium mb-2">Recent message</h3>
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-black rounded-md p-2 flex-shrink-0">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="8" y1="7" x2="16" y2="7" stroke="black" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="black" strokeWidth="2" />
                <line x1="8" y1="17" x2="16" y2="17" stroke="black" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex-grow">
              <p className="text-black">can you explain copilot to me</p>
              <p className="text-gray-500 text-sm">Fin · 1d ago</p>
            </div>
            <ArrowRight className="text-gray-400" size={18} />
          </div>
        </div>

        {/* Ask a question */}
        <button 
          onClick={handleAskQuestion}
          className="bg-white rounded-xl p-4 w-full flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">Ask a question</span>
          <div className="flex items-center">
            <div className="bg-black rounded-md p-1 mr-1">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="8" y1="7" x2="16" y2="7" stroke="black" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="black" strokeWidth="2" />
                <line x1="8" y1="17" x2="16" y2="17" stroke="black" strokeWidth="2" />
              </svg>
            </div>
            <ArrowRight className="text-gray-400" size={18} />
          </div>
        </button>

        {/* Service report card */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="bg-black text-white p-3">
            <div className="uppercase font-bold">
              <div>THE 2025</div>
              <div>CUSTOMER SERVICE</div>
              <div>TRANSFORMATION</div>
              <div>REPORT</div>
            </div>
            <div className="mt-8 text-xs text-gray-400 uppercase">
              <div>CUSTOMER SERVICE TRENDS</div>
              <div>AS WE DIVE INTO 2025</div>
            </div>
            {/* Decorative circle in the background */}
            <div className="absolute top-0 right-0 w-28 h-28 border border-white/20 rounded-full -mt-10 -mr-10 opacity-20"></div>
            
            {/* Logo in corner */}
            <div className="absolute top-3 right-3 bg-white/10 rounded-md p-1">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="8" y1="7" x2="16" y2="7" stroke="black" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="black" strokeWidth="2" />
                <line x1="8" y1="17" x2="16" y2="17" stroke="black" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
