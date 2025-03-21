
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface ConversationSearchBarProps {
  value: string;
  onSearch: (term: string) => void;
}

/**
 * Search input for filtering conversations
 */
const ConversationSearchBar: React.FC<ConversationSearchBarProps> = ({ value, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');

  // Sync with parent component's value
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onSearch(newValue);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search conversations..."
        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ConversationSearchBar;
