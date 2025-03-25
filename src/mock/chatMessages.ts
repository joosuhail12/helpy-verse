
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

// Helper function to create messages with proper timestamps
const createMessage = (
  content: string, 
  sender: 'user' | 'agent', 
  conversationId: string,
  minutesAgo: number = 0,
  attachments?: any[]
): ChatMessage => {
  const timestamp = new Date();
  timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);
  
  return {
    id: uuidv4(),
    content,
    sender,
    timestamp,
    conversationId,
    attachments,
    readBy: sender === 'user' ? ['agent-1'] : [],
    reactions: {}
  };
};

// Create some sample conversations
export const generateMockConversation = (conversationId: string): ChatMessage[] => {
  const mockMessages: ChatMessage[] = [
    createMessage("Hello! I'm having an issue with my recent order #12345", 'user', conversationId, 30),
    createMessage("Hi there! I'm happy to help you with your order. Could you please provide more details about the issue you're experiencing?", 'agent', conversationId, 28),
    createMessage("Sure, I ordered a laptop last week, but received a keyboard instead.", 'user', conversationId, 26),
    createMessage("I'm sorry to hear that. Let me check your order details. Can you confirm your email address?", 'agent', conversationId, 24),
    createMessage("It's customer@example.com", 'user', conversationId, 22),
    createMessage("Thank you. I can see your order now. You're right, there appears to have been a mistake with your order. I'll arrange for the correct item to be sent to you right away.", 'agent', conversationId, 19),
    createMessage("That's great! How long will it take to arrive?", 'user', conversationId, 17),
    createMessage("We'll expedite the shipping. You should receive the laptop within 2-3 business days. We'll also send you a return label for the keyboard.", 'agent', conversationId, 15),
    createMessage("Perfect, thank you for your help!", 'user', conversationId, 12),
    createMessage("You're welcome! Is there anything else I can assist you with today?", 'agent', conversationId, 10),
    createMessage("No, that's all. Thanks again!", 'user', conversationId, 8),
    createMessage("Great! Have a wonderful day, and don't hesitate to reach out if you need any further assistance.", 'agent', conversationId, 6)
  ];
  
  return mockMessages;
};

export const generateTechnicalSupportConversation = (conversationId: string): ChatMessage[] => {
  return [
    createMessage("Hi, I can't seem to log into my account. It keeps saying 'invalid credentials'.", 'user', conversationId, 45),
    createMessage("Hello! I'm sorry to hear you're having trouble logging in. Let's try to resolve this. Have you tried resetting your password?", 'agent', conversationId, 43),
    createMessage("Yes, I tried that but I'm not receiving the password reset email.", 'user', conversationId, 40),
    createMessage("I understand. Let me check if there are any issues with our email delivery system. Could you please provide the email address you're using for your account?", 'agent', conversationId, 38),
    createMessage("It's techuser@example.com", 'user', conversationId, 35),
    createMessage("Thank you. I've checked our systems and everything appears to be working correctly. The reset emails are being sent. Could you please check your spam or junk folder?", 'agent', conversationId, 32),
    createMessage("Oh! Found it in spam. Let me try resetting now.", 'user', conversationId, 28),
    createMessage("Great! Please let me know if you're able to reset your password and log in successfully.", 'agent', conversationId, 26),
    createMessage("It worked! I'm logged in now. Thank you for your help.", 'user', conversationId, 20),
    createMessage("Excellent! I'm glad we could resolve this issue. For future reference, you might want to add our domain to your safe senders list to prevent our emails from going to spam.", 'agent', conversationId, 18),
    createMessage("I'll do that. Thanks again for your assistance!", 'user', conversationId, 15),
    createMessage("You're very welcome! Is there anything else I can help you with today?", 'agent', conversationId, 12),
    createMessage("No, that's all I needed. Have a great day!", 'user', conversationId, 8),
    createMessage("You too! Don't hesitate to reach out if you need any further assistance.", 'agent', conversationId, 5)
  ];
};

export const generateBillingInquiryConversation = (conversationId: string): ChatMessage[] => {
  return [
    createMessage("I think I've been charged twice for my subscription this month. Can you check?", 'user', conversationId, 60),
    createMessage("Hello! I'd be happy to look into this billing concern for you. Could you please provide your account email or customer ID?", 'agent', conversationId, 58),
    createMessage("My email is billing@example.com", 'user', conversationId, 55),
    createMessage("Thank you. Give me a moment to check your billing history.", 'agent', conversationId, 52),
    createMessage("I can confirm that there were indeed two charges on your account this month. It appears the system processed a renewal right after a manual payment was made. I'll process a refund for the duplicate charge immediately.", 'agent', conversationId, 48),
    createMessage("That's a relief! How long will the refund take?", 'user', conversationId, 45),
    createMessage("The refund has been processed and should appear on your statement within 3-5 business days, depending on your financial institution.", 'agent', conversationId, 42),
    createMessage("Great, thank you for resolving this so quickly!", 'user', conversationId, 38),
    createMessage("You're welcome! I've also added a note to your account to prevent this from happening in the future. Is there anything else I can help you with today?", 'agent', conversationId, 35),
    createMessage("No, that's all I needed. Thank you!", 'user', conversationId, 30),
    createMessage("You're welcome! Have a wonderful day.", 'agent', conversationId, 28)
  ];
};

export const MOCK_CONVERSATIONS = {
  'customer-service': generateMockConversation,
  'technical-support': generateTechnicalSupportConversation,
  'billing-inquiry': generateBillingInquiryConversation
};
