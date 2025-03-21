
import React, { useState } from 'react';
import InfoStep from './form-steps/InfoStep';
import ChatStep from './form-steps/ChatStep';

interface NewChatProps {
  onConversationCreated: (conversationId?: string) => void;
  workspaceId?: string;
}

/**
 * New conversation form in the chat widget
 */
const NewChat: React.FC<NewChatProps> = ({ onConversationCreated, workspaceId }) => {
  const [step, setStep] = useState<'info' | 'chat'>('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: ''
  });
  
  const handleSubmitInfo = (data: { name: string; email: string; topic: string }) => {
    setFormData(data);
    setStep('chat');
  };
  
  const handleBack = () => {
    setStep('info');
  };
  
  const handleConversationCreated = (conversationId?: string) => {
    onConversationCreated(conversationId);
  };
  
  return (
    <div className="h-full">
      {step === 'info' && (
        <InfoStep 
          initialData={formData} 
          onSubmit={handleSubmitInfo} 
          onCancel={() => onConversationCreated()} 
        />
      )}
      
      {step === 'chat' && (
        <ChatStep 
          data={formData} 
          onBack={handleBack} 
          onConversationCreated={handleConversationCreated} 
          workspaceId={workspaceId}
        />
      )}
    </div>
  );
};

export default NewChat;
