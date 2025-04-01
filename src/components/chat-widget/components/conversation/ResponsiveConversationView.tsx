
import React from 'react';
import ConversationView from './ConversationView';
import ChatHeader from '../header/ChatHeader';

interface ResponsiveConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack: () => void;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  conversationId,
  workspaceId,
  onBack
}) => {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title="Chat Support" 
        onBackClick={onBack} 
        onClose={null}
      />
      <div className="flex-1 overflow-hidden">
        <ConversationView 
          conversationId={conversationId} 
          workspaceId={workspaceId} 
        />
      </div>
    </div>
  );
};

export default ResponsiveConversationView;
