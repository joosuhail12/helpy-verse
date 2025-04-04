
import React from 'react';
import ConversationView from './ConversationView';
import ChatHeader from '../header/ChatHeader';

interface ResponsiveConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack: () => void;
  onClose: () => void;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  conversationId,
  workspaceId,
  onBack,
  onClose
}) => {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title="Chat Support" 
        onBackClick={onBack} 
        onClose={onClose}
      />
      <div className="flex-1 overflow-hidden">
        <ConversationView 
          conversationId={conversationId} 
          workspaceId={workspaceId}
          onBack={onBack}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default ResponsiveConversationView;
