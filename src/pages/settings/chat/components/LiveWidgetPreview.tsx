
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import ConnectedChatWidget from '@/components/chat-widget/ConnectedChatWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PreviewControls from './preview/PreviewControls';
import SampleConversation from '@/components/chat-widget/components/conversation/SampleConversation';

interface LiveWidgetPreviewProps {
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
}

/**
 * Streamlined live preview of the chat widget that shows the actual widget with current settings
 */
const LiveWidgetPreview: React.FC<LiveWidgetPreviewProps> = ({ 
  settings,
  onSettingChange 
}) => {
  const [background, setBackground] = useState<string>('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [previewSettings, setPreviewSettings] = useState<ChatWidgetSettings>(settings);
  const [refreshPreview, setRefreshPreview] = useState<number>(Date.now());
  const [chatWidgetOpen, setChatWidgetOpen] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'home' | 'messages' | 'conversation'>('conversation');
  
  // Update preview settings when redux settings change
  React.useEffect(() => {
    setPreviewSettings(settings);
  }, [settings]);
  
  // Handle real-time setting changes without saving
  const handlePreviewSettingChange = (field: keyof ChatWidgetSettings, value: any) => {
    setPreviewSettings(prev => {
      const newSettings = { ...prev, [field]: value };
      setRefreshPreview(Date.now());
      return newSettings;
    });
    
    // Pass changes to parent
    onSettingChange(field, value);
  };

  const handleToggleWidget = () => {
    setChatWidgetOpen(!chatWidgetOpen);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Widget Preview</CardTitle>
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
          onViewChange={setCurrentView}
          currentView={currentView}
          onToggleWidget={handleToggleWidget}
          isWidgetOpen={chatWidgetOpen}
        />

        <Tabs defaultValue="live" className="w-full">
          <div className="px-3 border-b">
            <TabsList>
              <TabsTrigger value="live">Live Preview</TabsTrigger>
              <TabsTrigger value="mobile">Mobile View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="live" className="mt-0">
            <div 
              className="h-[500px] w-full rounded-b-lg overflow-hidden shadow-sm relative"
              style={{ 
                backgroundColor: background,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <ConnectedChatWidget 
                key={refreshPreview}
                workspaceId="preview-workspace-id" 
                isPreview={true}
                showLauncher={true}
                sampleMessages={true}
                previewSettings={previewSettings}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="mobile" className="mt-0">
            <div 
              className="h-[500px] flex items-center justify-center p-4 bg-gray-50"
            >
              <div className="relative h-full max-w-[375px] mx-auto bg-white border border-gray-200 overflow-hidden rounded-xl shadow-md">
                <div
                  className="h-full w-full"
                  style={{ 
                    backgroundColor: background,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!chatWidgetOpen ? (
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={handleToggleWidget}
                        className={`${previewSettings.launcherStyle === 'rectangle' ? 'rounded-lg px-3 py-2' : 'rounded-full w-14 h-14'} flex items-center justify-center shadow-lg transition-colors`}
                        style={{ backgroundColor: previewSettings.primaryColor }}
                      >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="h-full">
                      <SampleConversation 
                        onClose={handleToggleWidget}
                        position={previewSettings.position}
                        compact={previewSettings.compact}
                        headerTitle={previewSettings.headerTitle}
                        headerColor={previewSettings.headerColor}
                        currentView={currentView}
                        onChangeView={setCurrentView}
                        userMessageColor={previewSettings.userMessageColor}
                        agentMessageColor={previewSettings.agentMessageColor}
                        messageBoxColor={previewSettings.messageBoxColor}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiveWidgetPreview;
