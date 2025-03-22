
import React, { useState } from 'react';
import { ArrowLeft, Users, Circle } from 'lucide-react';
import MessageSearch from './MessageSearch';
import { Message } from './types';
import { useTheme } from '../../theme/ThemeContext';

interface EnhancedConversationHeaderProps {
  onBack: () => void;
  title?: string;
  messages: Message[];
  onSearchResults?: (messages: Message[]) => void;
  activeParticipants?: Array<{
    id: string;
    name: string;
    type: 'customer' | 'agent';
    status?: 'online' | 'away' | 'offline';
    lastActive?: string;
  }>;
}

/**
 * Enhanced conversation header with message search and presence indicators
 */
const EnhancedConversationHeader: React.FC<EnhancedConversationHeaderProps> = ({
  onBack,
  title = 'Conversation',
  messages,
  onSearchResults,
  activeParticipants = []
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { theme } = useTheme();
  
  const handleSearchResults = (matchedMessages: Message[]) => {
    if (onSearchResults) {
      onSearchResults(matchedMessages);
      setIsSearchActive(true);
    }
  };
  
  const handleClearSearch = () => {
    if (onSearchResults) {
      onSearchResults([]);
      setIsSearchActive(false);
    }
  };
  
  // Format lastActive time
  const formatLastActive = (timestamp?: string) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      
      return date.toLocaleDateString();
    } catch (e) {
      return '';
    }
  };
  
  return (
    <div 
      className="p-3 md:p-4 border-b flex items-center justify-between"
      style={{ backgroundColor: theme.colors.headerBackground, color: theme.colors.headerText }}
    >
      <div className="flex items-center">
        <button 
          onClick={onBack}
          className="mr-2 p-1 rounded-full hover:bg-gray-100/20 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft 
            className="h-5 w-5" 
            color={theme.colors.headerText}
          />
        </button>
        
        {!isSearchActive && (
          <div>
            <h3 className="font-medium text-base md:text-lg">{title}</h3>
            <div className="flex items-center text-xs">
              {activeParticipants.length > 0 ? (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{activeParticipants.length} active</span>
                </div>
              ) : (
                <span>No active participants</span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <MessageSearch 
          messages={messages}
          onSearchResultsChange={handleSearchResults}
          onClearSearch={handleClearSearch}
        />
        
        {activeParticipants.length > 0 && (
          <div className="relative group">
            <button 
              className="p-2 rounded-full text-gray-100 hover:bg-gray-100/20 transition-colors"
              aria-label="Show participants"
              aria-haspopup="true"
            >
              <Users className="h-4 w-4" />
            </button>
            
            <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 hidden group-hover:block z-10">
              <div className="p-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Active Participants</h4>
                <ul className="space-y-2">
                  {activeParticipants.map(participant => (
                    <li key={participant.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Circle 
                          className="h-2 w-2" 
                          fill={participant.status === 'online' ? '#10b981' : 
                                 participant.status === 'away' ? '#f59e0b' : '#d1d5db'} 
                          color="transparent"
                        />
                        <span className="text-gray-800">{participant.name}</span>
                        <span className="text-xs text-gray-500">
                          ({participant.type})
                        </span>
                      </div>
                      {participant.lastActive && (
                        <span className="text-xs text-gray-500">
                          {formatLastActive(participant.lastActive)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedConversationHeader;
