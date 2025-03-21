
import React, { useState } from 'react';
import { getAblyChannel } from '@/utils/ably';
import InfoStep from './form-steps/InfoStep';
import ChatStep from './form-steps/ChatStep';

interface NewChatProps {
  onConversationCreated: () => void;
}

/**
 * New chat interface for starting a conversation
 */
const NewChat: React.FC<NewChatProps> = ({ onConversationCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('Support');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'info' | 'chat'>('info');

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setStep('chat');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setSubmitting(true);
    
    try {
      // In a real implementation, we would use Ably to publish the message
      const channel = await getAblyChannel('new-support-tickets');
      
      await channel.publish('new-ticket', {
        name,
        email,
        topic,
        message,
        timestamp: new Date().toISOString()
      });
      
      console.log('Message sent:', { name, email, message, topic });
      
      // Clear form
      setMessage('');
      setSubmitting(false);
      
      // Simulate success and redirect to conversations
      setTimeout(() => {
        onConversationCreated();
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitting(false);
    }
  };

  if (step === 'info') {
    return (
      <InfoStep
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        topic={topic}
        setTopic={setTopic}
        onSubmit={handleSubmitInfo}
        onBack={onConversationCreated}
      />
    );
  }

  return (
    <ChatStep
      name={name}
      email={email}
      topic={topic}
      message={message}
      setMessage={setMessage}
      onSendMessage={handleSendMessage}
      onBack={() => setStep('info')}
      submitting={submitting}
    />
  );
};

export default NewChat;
