
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Message } from './types';

interface MessageSearchProps {
  messages: Message[];
  onSearchResultsChange: (matchedMessages: Message[]) => void;
  onClearSearch: () => void;
}

/**
 * Search component for finding messages within a conversation
 */
const MessageSearch: React.FC<MessageSearchProps> = ({ 
  messages, 
  onSearchResultsChange,
  onClearSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState(false);
  
  // Filter messages when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      onClearSearch();
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchedMessages = messages.filter(message => 
      message.text?.toLowerCase().includes(lowerSearchTerm)
    );
    
    onSearchResultsChange(matchedMessages);
  }, [searchTerm, messages, onSearchResultsChange, onClearSearch]);
  
  const handleClear = () => {
    setSearchTerm('');
    onClearSearch();
  };
  
  return (
    <div className={`transition-all duration-300 ${isActive ? 'w-full' : 'w-auto'}`}>
      {isActive ? (
        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/30 focus:border-transparent"
            aria-label="Search messages"
            autoFocus
          />
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsActive(true)}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Search messages"
        >
          <Search className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default MessageSearch;
