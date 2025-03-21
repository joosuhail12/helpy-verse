
import React, { useState, useEffect } from 'react';
import { getAblyChannel } from '@/utils/ably';
import InfoStep from './form-steps/InfoStep';
import ChatStep from './form-steps/ChatStep';
import { isAuthenticated, getUserId } from '@/utils/auth/tokenManager';

interface NewChatProps {
  onConversationCreated: (conversationId?: string) => void;
}

/**
 * New chat interface for starting a conversation
 */
const NewChat: React.FC<NewChatProps> = ({ onConversationCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'info' | 'chat'>('info');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkUserAuth = async () => {
      const loggedIn = isAuthenticated();
      setIsUserLoggedIn(loggedIn);
      
      if (loggedIn) {
        try {
          // In a real implementation, fetch user info from your backend
          const userId = getUserId();
          console.log('Logged in user ID:', userId);
          
          // Fetch user profile (mock implementation)
          setTimeout(() => {
            setName('Logged User');
            setEmail('user@example.com');
          }, 300);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    checkUserAuth();
  }, []);

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUserLoggedIn || (name && email)) {
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
        message,
        timestamp: new Date().toISOString(),
        userId: isUserLoggedIn ? getUserId() : null
      });
      
      console.log('Message sent:', { name, email, message });
      
      // Clear form
      setMessage('');
      setSubmitting(false);
      
      // Generate a mock conversation ID
      const mockConversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate success and redirect to conversations
      setTimeout(() => {
        onConversationCreated(mockConversationId);
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
        onSubmit={handleSubmitInfo}
        onBack={onConversationCreated}
        isUserLoggedIn={isUserLoggedIn}
      />
    );
  }

  return (
    <ChatStep
      name={name}
      email={email}
      message={message}
      setMessage={setMessage}
      onSendMessage={handleSendMessage}
      onBack={() => setStep('info')}
      submitting={submitting}
    />
  );
};

export default NewChat;
