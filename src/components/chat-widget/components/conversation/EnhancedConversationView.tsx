
import React, { useState } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import MessageSearch from './MessageSearch';
import { ChatMessage } from './types';

interface EnhancedConversationViewProps {
  conversationId: string;
  showSearch?: boolean;
  showAttachments?: boolean;
  showReactions?: boolean;
  showReadReceipts?: boolean;
  encrypted?: boolean;
}

const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({
  conversationId,
  showSearch = false,
  showAttachments = true,
  showReactions = false,
  showReadReceipts = true,
  encrypted = false
}) => {
  const { messages, sendMessage, searchMessages } = useChat();
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    if (!query) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results = searchMessages(query);
    setSearchResults(results);
  };

  const handleSendMessage = (content: string, attachments?: File[]) => {
    sendMessage(conversationId, content, attachments);
  };

  return (
    <div className="flex flex-col h-full">
      {showSearch && (
        <div className="border-b p-2">
          <MessageSearch onSearch={handleSearch} />
        </div>
      )}
      
      <MessageList 
        messages={isSearching ? searchResults : messages} 
        conversationId={conversationId}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        showAttachments={showAttachments}
        encrypted={encrypted}
      />
    </div>
  );
};

export default EnhancedConversationView;
