
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { ChatWidget } from './ChatWidget';
import { selectChatWidgetSettings } from '@/store/slices/chatWidgetSettings';
import { loadChatWidgetSettings } from '@/store/slices/chatWidgetSettings';

interface ConnectedChatWidgetProps {
  workspaceId: string;
}

const ConnectedChatWidget: React.FC<ConnectedChatWidgetProps> = ({ workspaceId }) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectChatWidgetSettings);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    dispatch(loadChatWidgetSettings());
  }, [dispatch]);

  return (
    <ChatWidget 
      workspaceId={workspaceId} 
      settings={settings}
    />
  );
};

export default ConnectedChatWidget;
