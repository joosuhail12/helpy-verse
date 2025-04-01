
import React from 'react';
import LazyMessagesView from '@/widgets/chat/views/LazyMessagesView';
import { View } from '@/widgets/chat/types';

interface LazyMessagesViewComponentProps {
  workspaceId: string;
  onClose: () => void;
  setActiveView: (view: string) => void;
  onStartConversation: (message: string) => Promise<void>;
}

/**
 * Re-export of the consolidated LazyMessagesView with adapter for component-specific props
 */
const LazyMessagesViewComponent: React.FC<LazyMessagesViewComponentProps> = (props) => {
  // Create a handler for the onSelectConversation that properly works with the function from props.setActiveView
  const handleSelectConversation = () => {
    props.setActiveView('conversation');
  };

  return (
    <LazyMessagesView
      workspaceId={props.workspaceId}
      onClose={props.onClose}
      setActiveView={props.setActiveView}
      onStartConversation={props.onStartConversation}
      onSelectConversation={handleSelectConversation}
    />
  );
};

export default LazyMessagesViewComponent;
