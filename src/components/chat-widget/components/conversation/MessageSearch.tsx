
import React from 'react';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';
import { MessageSearchProps } from './types';

const MessageSearch: React.FC<MessageSearchProps> = ({
  value,
  onChange,
  resultCount,
  currentResult,
  onNavigate
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        onNavigate('prev');
      } else {
        onNavigate('next');
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div className="flex items-center p-2 bg-white border-b border-gray-200">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search messages..."
          className="pl-10 pr-20 py-1.5 w-full text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        />
        {value && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
            {resultCount > 0 && (
              <span className="text-xs text-gray-500">
                {currentResult + 1}/{resultCount}
              </span>
            )}
            <button
              onClick={() => onNavigate('prev')}
              className="p-1 rounded hover:bg-gray-100"
              disabled={resultCount === 0}
              aria-label="Previous result"
            >
              <ChevronUp className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={() => onNavigate('next')}
              className="p-1 rounded hover:bg-gray-100"
              disabled={resultCount === 0}
              aria-label="Next result"
            >
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={handleClear}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageSearch;
