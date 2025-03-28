
import React from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { MessageSearchProps } from './types';

const MessageSearch: React.FC<MessageSearchProps> = ({
  value,
  onChange,
  resultCount,
  currentResult,
  onNavigate
}) => {
  return (
    <div className="border-b p-2 flex items-center space-x-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search messages..."
          className="w-full pl-8 pr-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      
      {resultCount > 0 && (
        <>
          <div className="text-xs text-gray-500">
            {currentResult + 1} of {resultCount}
          </div>
          <button
            onClick={() => onNavigate('prev')}
            className="p-1 rounded-md hover:bg-gray-100"
            disabled={resultCount <= 1}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="p-1 rounded-md hover:bg-gray-100"
            disabled={resultCount <= 1}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
};

export default MessageSearch;
