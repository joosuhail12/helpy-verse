
import { RootState } from '@/store/store';
import { createSelector } from '@reduxjs/toolkit';

// Base selectors
export const selectChatState = (state: RootState) => state.chat;
export const selectConnectionState = (state: RootState) => state.chat.connectionState;
export const selectIsConnected = (state: RootState) => state.chat.isConnected;
export const selectCurrentConversationId = (state: RootState) => state.chat.currentConversationId;
export const selectUnreadCount = (state: RootState) => state.chat.unreadCount;
export const selectError = (state: RootState) => state.chat.error;

// Memoized selectors
export const selectConversations = createSelector(
  selectChatState,
  (chatState) => Object.keys(chatState.conversations)
);

export const selectConversationMessages = createSelector(
  [selectChatState, (_, conversationId: string) => conversationId],
  (chatState, conversationId) => chatState.conversations[conversationId]?.messages || []
);

export const selectConversationLoading = createSelector(
  [selectChatState, (_, conversationId: string) => conversationId],
  (chatState, conversationId) => chatState.conversations[conversationId]?.isLoading || false
);

export const selectHasMoreMessages = createSelector(
  [selectChatState, (_, conversationId: string) => conversationId],
  (chatState, conversationId) => chatState.conversations[conversationId]?.hasMoreMessages || false
);

export const selectTotalMessages = createSelector(
  [selectChatState, (_, conversationId: string) => conversationId],
  (chatState, conversationId) => chatState.conversations[conversationId]?.totalCount || 0
);

export const selectCurrentConversationMessages = createSelector(
  [selectChatState, selectCurrentConversationId],
  (chatState, currentConversationId) => {
    if (!currentConversationId) return [];
    return chatState.conversations[currentConversationId]?.messages || [];
  }
);
