
import React from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface ConversationSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * Search bar for filtering conversations
 */
const ConversationSearchBar = ({ searchQuery, setSearchQuery }: ConversationSearchBarProps) => {
  return (
    <div className="border-t border-gray-200 p-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Type or hum what you're looking for"
          className="w-full border border-gray-200 rounded-full py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600"
            onClick={() => setSearchQuery('')}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConversationSearchBar;
