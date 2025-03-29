
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/redux';
import { selectChatWidgetSettings } from '@/store/slices/chatWidgetSettings';
import ConnectedChatWidget from '@/components/chat-widget/ConnectedChatWidget';
import PreviewControls from './PreviewControls';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

/**
 * Live preview of the chat widget that shows the actual widget with current settings
 */
const LiveChatPreview = () => {
  const settings = useAppSelector(selectChatWidgetSettings);
  const [background, setBackground] = useState<string>('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [previewSettings, setPreviewSettings] = useState<ChatWidgetSettings>(settings);
  
  // Update preview settings when redux settings change
  useEffect(() => {
    setPreviewSettings(settings);
  }, [settings]);
  
  // Handle real-time setting changes without saving
  const handlePreviewSettingChange = (field: keyof ChatWidgetSettings, value: any) => {
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
          <ConnectedChatWidget 
            workspaceId="preview-workspace-id" 
            isPreview={true}
            showLauncher={true}
            sampleMessages={true}
            previewSettings={previewSettings}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveChatPreview;
