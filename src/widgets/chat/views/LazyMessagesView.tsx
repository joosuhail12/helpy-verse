
import React from 'react';
import MessagesView from './MessagesView';

interface LazyMessagesViewProps {
  onSelectConversation: () => void;
  onClose: () => void;
  onStartConversation: (message: string) => void;
}

const LazyMessagesView: React.FC<LazyMessagesViewProps> = ({
  onSelectConversation,
  onClose,
  onStartConversation
}) => {
  return (
    <MessagesView
      onSelectConversation={onSelectConversation}
      onClose={onClose}
      onStartConversation={onStartConversation}
    />
  );
};

export default LazyMessagesView;
