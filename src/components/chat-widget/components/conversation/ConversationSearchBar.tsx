
import React from 'react';
import { ArrowRight } from 'lucide-react';

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
        <input
          type="text"
          placeholder="Type or hum what your looking for"
          className="w-full border border-gray-200 rounded-md py-2 pr-10 pl-4 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600">
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ConversationSearchBar;
