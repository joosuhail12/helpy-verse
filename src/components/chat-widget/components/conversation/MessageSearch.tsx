
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ArrowUp, ArrowDown } from 'lucide-react';
import { ChatMessage } from './types';
import { useThemeContext } from '@/context/ThemeContext';

interface MessageSearchProps {
  messages: ChatMessage[];
  onResultSelect: (messageId: string) => void;
  onClose: () => void;
}

const MessageSearch: React.FC<MessageSearchProps> = ({ 
  messages,
  onResultSelect,
  onClose
}) => {
  const { colors } = useThemeContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<ChatMessage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const matchedMessages = messages.filter(message => 
      message.content.toLowerCase().includes(searchTermLower)
    );
    
    setResults(matchedMessages);
    setSelectedIndex(matchedMessages.length > 0 ? 0 : -1);
  }, [searchTerm, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && results.length > 0 && selectedIndex >= 0) {
      onResultSelect(results[selectedIndex].id);
    } else if (e.key === 'ArrowDown' && results.length > 0) {
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp' && results.length > 0) {
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    }
  };

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <mark key={i} style={{ backgroundColor: colors.primary + '40', padding: 0 }}>{part}</mark> 
        : part
    );
  };

  return (
    <div className="border-b border-gray-200" style={{ backgroundColor: colors.background }}>
      <div className="flex items-center p-2">
        <Search className="h-4 w-4 text-gray-400 mx-2 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search in conversation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-sm py-1"
          style={{ color: colors.foreground }}
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="text-gray-400 hover:text-gray-600 mr-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 ml-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {results.length > 0 && (
        <div className="max-h-60 overflow-y-auto p-2 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </div>
          {results.map((message, index) => (
            <div
              key={message.id}
              className={`p-2 rounded-md text-sm cursor-pointer mb-1 ${
                index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
              onClick={() => onResultSelect(message.id)}
            >
              <div className="font-medium mb-1">
                {message.sender === 'user' ? 'You' : 'Agent'}
                <span className="ml-2 text-xs text-gray-500">
                  {typeof message.timestamp === 'string' 
                    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                </span>
              </div>
              <div className="line-clamp-2 text-gray-600">
                {getHighlightedText(message.content, searchTerm)}
              </div>
            </div>
          ))}
        </div>
      )}

      {searchTerm && results.length === 0 && (
        <div className="p-4 text-center text-gray-500 text-sm">
          No messages found
        </div>
      )}

      {results.length > 0 && (
        <div className="flex items-center justify-between p-2 border-t border-gray-200 text-xs text-gray-500">
          <span>{selectedIndex + 1} of {results.length}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedIndex(prev => (prev - 1 + results.length) % results.length)}
              className="p-1 rounded hover:bg-gray-100"
              disabled={results.length <= 1}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSelectedIndex(prev => (prev + 1) % results.length)}
              className="p-1 rounded hover:bg-gray-100"
              disabled={results.length <= 1}
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSearch;
