
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import { View } from '../container/ChatWidgetContainer';

interface HomeViewProps {
  workspaceId: string;
  onClose: () => void;
  setActiveView: (view: View) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ workspaceId, setActiveView }) => {
  const { createNewConversation, selectConversation } = useChat();
  const { colors, labels } = useThemeContext();

  const handleAskQuestion = async () => {
    const conversation = await createNewConversation("New question");
    selectConversation(conversation);
    setActiveView('conversation');
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header with logo */}
      <div className="pt-6 pb-4 px-6 text-gray-800" style={{ color: colors.foreground }}>
        <div className="bg-gray-100 w-10 h-10 rounded-md flex items-center justify-center mb-4" 
          style={{ backgroundColor: colors.border }}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill={colors.foreground}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" />
            <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h1 className="text-2xl text-gray-500 font-light mb-1">{labels.welcomeTitle}</h1>
        <h2 className="text-3xl font-medium">{labels.welcomeSubtitle}</h2>
      </div>

      {/* Content area */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto space-y-4">
        {/* Recent message */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100" 
          style={{ borderColor: colors.border }}>
          <h3 className="font-medium mb-2">{labels.recentMessagesTitle}</h3>
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-gray-100 rounded-md p-2 flex-shrink-0" 
              style={{ backgroundColor: colors.border }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill={colors.foreground}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex-grow">
              <p className="text-gray-800" style={{ color: colors.foreground }}>can you explain copilot to me</p>
              <p className="text-gray-500 text-sm">Fin · 1d ago</p>
            </div>
            <ArrowRight className="text-gray-400" size={18} />
          </div>
        </div>

        {/* Ask a question */}
        <button 
          onClick={handleAskQuestion}
          className="bg-white rounded-xl p-4 w-full flex items-center justify-between hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm"
          style={{ borderColor: colors.border }}
        >
          <span className="font-medium">{labels.askQuestionButton}</span>
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-md p-1 mr-1" 
              style={{ backgroundColor: colors.border }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill={colors.foreground}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <ArrowRight className="text-gray-400" size={18} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomeView;
