
import React, { useState, useEffect } from 'react';
import { getAblyChannel } from '@/utils/ably';
import InfoStep from './form-steps/InfoStep';
import ChatStep from './form-steps/ChatStep';
import { isAuthenticated, getUserId } from '@/utils/auth/tokenManager';
import { toast } from 'sonner';

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

  // Check if user is logged in or has session data
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
            // Skip info collection step for logged in users
            setStep('chat');
          }, 300);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // Check if user info is in session storage
        const sessionName = sessionStorage.getItem('chat-widget-user-name');
        const sessionEmail = sessionStorage.getItem('chat-widget-user-email');
        
        if (sessionName && sessionEmail) {
          setName(sessionName);
          setEmail(sessionEmail);
          // Skip the info step if user data is available
          setStep('chat');
        }
      }
    };
    
    checkUserAuth();
  }, []);

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isUserLoggedIn || (name && email)) {
      // Store user info in session storage for future chats
      if (!isUserLoggedIn && name && email) {
        sessionStorage.setItem('chat-widget-user-name', name);
        sessionStorage.setItem('chat-widget-user-email', email);
      }
      
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
      
      // Show success notification
      toast.success('Message sent successfully');
      
      // Simulate success and redirect to conversations
      setTimeout(() => {
        onConversationCreated(mockConversationId);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
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
