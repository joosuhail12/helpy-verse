
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import ConnectedChatWidget from '@/components/chat-widget/ConnectedChatWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PreviewControls from './preview/PreviewControls';
import SampleConversation from '@/components/chat-widget/components/conversation/SampleConversation';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <Card className="h-full overflow-hidden border shadow-md bg-white">
      <CardHeader className="pb-0 pt-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Widget Preview
            <Badge variant="outline" className="ml-2 font-normal text-xs">Live</Badge>
          </CardTitle>
        </div>
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
          <div className="px-4 py-2 border-b bg-gray-50">
            <TabsList className="grid w-56 grid-cols-2">
              <TabsTrigger value="live" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Monitor className="h-4 w-4 mr-1.5" />
                <span>Desktop View</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Smartphone className="h-4 w-4 mr-1.5" />
                <span>Mobile View</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="live" className="mt-0">
            <div 
              className="h-[520px] w-full rounded-b-lg overflow-hidden shadow-inner relative transition-all duration-300 ease-in-out"
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
              className="h-[520px] flex items-center justify-center p-6 bg-gray-50"
            >
              <div className="relative h-full max-w-[375px] mx-auto bg-white border border-gray-300 overflow-hidden rounded-3xl shadow-xl">
                <div className="absolute top-0 left-0 right-0 h-6 bg-black rounded-t-3xl flex justify-center items-center">
                  <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
                </div>
                <div
                  className="h-full w-full pt-6"
                  style={{ 
                    backgroundColor: background,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!chatWidgetOpen ? (
                    <div className="absolute bottom-8 right-6">
                      <button
                        onClick={handleToggleWidget}
                        className={`${previewSettings.launcherStyle === 'rectangle' ? 'rounded-lg px-3 py-2' : 'rounded-full w-14 h-14'} flex items-center justify-center shadow-lg transition-transform hover:scale-105`}
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
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-b-3xl"></div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiveWidgetPreview;
