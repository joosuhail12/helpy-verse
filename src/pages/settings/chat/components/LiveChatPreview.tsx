
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/redux';
import { selectChatWidgetSettings } from '@/store/slices/chatWidgetSettings';
import { ChatWidget } from '@/components/chat-widget/ChatWidget';
import PreviewControls from './PreviewControls';

/**
 * Live preview of the chat widget that shows the actual widget with current settings
 */
const LiveChatPreview = () => {
  const settings = useAppSelector(selectChatWidgetSettings);
  const [background, setBackground] = useState<string>('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [previewSettings, setPreviewSettings] = useState(settings);
  
  // Handle real-time setting changes without saving
  const handlePreviewSettingChange = (field: string, value: any) => {
    setPreviewSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Widget Preview</CardTitle>
        <CardDescription>See how your chat widget will appear</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <PreviewControls 
          background={background}
          setBackground={setBackground}
          backgroundImage={backgroundImage}
          setBackgroundImage={setBackgroundImage}
          settings={settings}
          previewSettings={previewSettings}
          onSettingChange={handlePreviewSettingChange}
        />
        <div 
          className="h-[600px] w-full border border-gray-200 rounded-b-lg overflow-hidden shadow-md relative"
          style={{ 
            backgroundColor: background,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <ChatWidget 
            workspaceId="preview-workspace-id"
            settings={previewSettings}
            isPreview={true}
            showLauncher={true}
            sampleMessages={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveChatPreview;
