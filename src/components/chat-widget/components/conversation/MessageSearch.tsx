
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

export interface MessageSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const MessageSearch: React.FC<MessageSearchProps> = ({
  onSearch,
  placeholder = 'Search messages...'
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { colors } = useThemeContext();
  
  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);
  
  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-2 rounded-md ${
        isFocused ? 'ring-2 ring-primary/20' : ''
      }`}
      style={{ 
        backgroundColor: colors.backgroundSecondary,
        border: `1px solid ${isFocused ? colors.primary : colors.border}`
      }}
    >
      <Search className="h-4 w-4 text-gray-400" />
      
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm"
        style={{ color: colors.foreground }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {query && (
        <button 
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default MessageSearch;
