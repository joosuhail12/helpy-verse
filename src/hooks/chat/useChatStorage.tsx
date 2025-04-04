
import { useCallback } from 'react';
import { Conversation, ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { useAbly } from '@/context/AblyContext';

export interface UseChatStorageReturn {
  saveConversations: (conversations: Conversation[]) => void;
  loadConversations: () => Conversation[] | null;
  saveCurrentConversationId: (id: string) => void;
  loadCurrentConversationId: () => string | null;
  saveMessages: (messages: ChatMessage[]) => void;
  loadMessages: () => ChatMessage[] | null;
}

export const useChatStorage = (): UseChatStorageReturn => {
  const { workspaceId } = useAbly();
  
  const getConversationsKey = useCallback(() => `chat_conversations_${workspaceId}`, [workspaceId]);
  const getCurrentConversationKey = useCallback(() => `chat_current_conversation_${workspaceId}`, [workspaceId]);
  const getMessagesKey = useCallback(() => `chat_messages_${workspaceId}`, [workspaceId]);

  const saveConversations = useCallback((conversations: Conversation[]) => {
    localStorage.setItem(getConversationsKey(), JSON.stringify(conversations));
  }, [getConversationsKey]);

  const loadConversations = useCallback((): Conversation[] | null => {
    const saved = localStorage.getItem(getConversationsKey());
    if (saved) {
      try {
        return JSON.parse(saved) as Conversation[];
      } catch (e) {
        console.error('Error parsing saved conversations:', e);
        return null;
      }
    }
    return null;
  }, [getConversationsKey]);

  const saveCurrentConversationId = useCallback((id: string) => {
    localStorage.setItem(getCurrentConversationKey(), id);
  }, [getCurrentConversationKey]);

  const loadCurrentConversationId = useCallback((): string | null => {
    return localStorage.getItem(getCurrentConversationKey());
  }, [getCurrentConversationKey]);

  const saveMessages = useCallback((messages: ChatMessage[]) => {
    localStorage.setItem(getMessagesKey(), JSON.stringify(messages));
  }, [getMessagesKey]);

  const loadMessages = useCallback((): ChatMessage[] | null => {
    const saved = localStorage.getItem(getMessagesKey());
    if (saved) {
      try {
        return JSON.parse(saved) as ChatMessage[];
      } catch (e) {
        console.error('Error parsing saved messages:', e);
        return null;
      }
    }
    return null;
  }, [getMessagesKey]);

  return {
    saveConversations,
    loadConversations,
    saveCurrentConversationId,
    loadCurrentConversationId,
    saveMessages,
    loadMessages
  };
};
