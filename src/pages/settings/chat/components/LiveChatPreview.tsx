
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/redux';
import { selectChatWidgetSettings } from '@/store/slices/chatWidgetSettings';
import { ChatWidget } from '@/components/chat-widget/ChatWidget';

/**
 * Live preview of the chat widget that shows the actual widget with current settings
 */
const LiveChatPreview = () => {
  const settings = useAppSelector(selectChatWidgetSettings);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Widget Preview</CardTitle>
        <CardDescription>See how your chat widget will appear</CardDescription>
      </CardHeader>
      <CardContent className="p-6 flex-grow overflow-hidden">
        <div className="h-full w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md flex items-center justify-center">
          <ChatWidget 
            workspaceId="preview-workspace-id"
            settings={settings}
            isPreview={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveChatPreview;
