
import { ChatbotList } from '@/components/automation/chatbots/ChatbotList';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchChatbots } from '@/store/slices/chatbots/chatbotsSlice';
import { useEffect } from 'react';

const ChatbotProfiles = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchChatbots());
  }, [dispatch]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chatbot Profiles</h1>
        <p className="text-muted-foreground mt-1">Manage your AI chatbots and their configurations</p>
      </div>
      <ChatbotList />
    </div>
  );
};

export default ChatbotProfiles;

