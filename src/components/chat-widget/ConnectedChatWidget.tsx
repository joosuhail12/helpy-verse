import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { ChatWidget } from './ChatWidget';
import { selectChatWidgetSettings } from '@/store/slices/chatWidgetSettings';
import { loadChatWidgetSettings } from '@/store/slices/chatWidgetSettings';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface ConnectedChatWidgetProps {
  workspaceId: string;
  isPreview?: boolean;
  showLauncher?: boolean;
  sampleMessages?: boolean;
  previewSettings?: ChatWidgetSettings;
}

const ConnectedChatWidget: React.FC<ConnectedChatWidgetProps> = ({ 
  workspaceId,
  isPreview = false,
  showLauncher = false,
  sampleMessages = false,
  previewSettings
}) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectChatWidgetSettings);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    dispatch(loadChatWidgetSettings());
  }, [dispatch]);

  // Use previewSettings if provided (for the preview in settings page)
  // Otherwise use the actual settings from Redux store
  const widgetSettings = previewSettings || settings;

  return (
    <ChatWidget 
      workspaceId={workspaceId} 
      settings={widgetSettings}
      isPreview={isPreview}
      showLauncher={showLauncher}
      sampleMessages={sampleMessages}
    />
  );
};

export default ConnectedChatWidget;
