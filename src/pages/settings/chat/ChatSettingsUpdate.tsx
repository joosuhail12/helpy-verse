
import React from 'react';
import ChatSettingsContent from './ChatSettings';
import { PathProvider } from '@/context/PathContext';

const ChatSettingsUpdate = () => {
  return (
    <PathProvider base="/settings/chat">
      <ChatSettingsContent />
    </PathProvider>
  );
};

export default ChatSettingsUpdate;
