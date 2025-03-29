
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import ConnectedChatWidget from '@/components/chat-widget/ConnectedChatWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StreamlinedPreviewControls from './preview/StreamlinedPreviewControls';
import SampleConversation from '@/components/chat-widget/components/conversation/SampleConversation';
import { Sparkles, ArrowDownToLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/context/ThemeContext';
import DeviceFrame from './preview/DeviceFrame';
import ResponsiveControls from './preview/ResponsiveControls';
import { useIsMobile } from '@/hooks/use-mobile';

type ChatView = 'home' | 'messages' | 'conversation';
type DeviceType = 'iphone' | 'android' | 'tablet' | 'desktop';
type Orientation = 'portrait' | 'landscape';

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
  const [currentView, setCurrentView] = useState<ChatView>('conversation');
  const [deviceType, setDeviceType] = useState<DeviceType>('iphone');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    setPreviewSettings(settings);
  }, [settings]);
  
  const handlePreviewSettingChange = (field: keyof ChatWidgetSettings, value: any) => {
    setPreviewSettings(prev => {
      const newSettings = { ...prev, [field]: value };
      setRefreshPreview(Date.now());
      return newSettings;
    });
    
    onSettingChange(field, value);
  };

  const handleToggleWidget = () => {
    setChatWidgetOpen(!chatWidgetOpen);
  };

  const handleViewChange = (view: 'home' | 'messages' | 'conversation') => {
    setCurrentView(view);
  };

  return (
    <Card className="h-full overflow-hidden border shadow-md bg-gradient-to-b from-white to-gray-50">
      <CardHeader className="pb-0 pt-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Widget Preview
            <Badge variant="outline" className="ml-2 font-normal text-xs bg-purple-50 text-purple-700 border-purple-200">
              Live
            </Badge>
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                  <ArrowDownToLine className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Export Preview</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <StreamlinedPreviewControls 
          background={background}
          setBackground={setBackground}
          backgroundImage={backgroundImage}
          setBackgroundImage={setBackgroundImage}
          settings={settings}
          previewSettings={previewSettings}
          onSettingChange={handlePreviewSettingChange}
          onViewChange={handleViewChange}
          currentView={currentView}
          onToggleWidget={handleToggleWidget}
          isWidgetOpen={chatWidgetOpen}
        />

        <Tabs defaultValue="mobile" className="w-full">
          <div className="px-4 py-2 border-b bg-gray-50">
            <TabsList className="grid w-56 grid-cols-2">
              <TabsTrigger value="desktop" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <span>Desktop View</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <span>Mobile View</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="desktop" className="mt-0">
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
            <ResponsiveControls 
              deviceType={deviceType}
              setDeviceType={setDeviceType}
              orientation={orientation}
              setOrientation={setOrientation}
            />
            
            <div 
              className={`h-[520px] flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100 ${
                orientation === 'landscape' ? 'landscape-container' : ''
              }`}
            >
              <DeviceFrame 
                deviceType={deviceType} 
                className={orientation === 'landscape' ? 'transform -rotate-90 scale-75' : ''}
              >
                <div
                  className={`h-full w-full ${orientation === 'landscape' ? 'transform rotate-90' : ''}`}
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
                        className={`${previewSettings.launcherStyle === 'rectangle' ? 'rounded-lg px-3 py-2' : 'rounded-full w-14 h-14'} flex items-center justify-center shadow-lg transition-transform hover:scale-105 animate-pulse`}
                        style={{ backgroundColor: previewSettings.primaryColor }}
                      >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="h-full">
                      <ThemeProvider initialTheme={{
                        colors: {
                          primary: previewSettings.primaryColor,
                          primaryForeground: '#ffffff',
                          background: '#ffffff',
                          backgroundSecondary: '#f9f9f9',
                          foreground: '#1A1F2C',
                          border: '#eaeaea',
                          userMessage: previewSettings.userMessageColor,
                          userMessageText: '#ffffff',
                          agentMessage: previewSettings.agentMessageColor,
                          agentMessageText: '#1A1F2C',
                          inputBackground: previewSettings.messageBoxColor,
                          headerBackground: previewSettings.headerColor
                        },
                        position: previewSettings.position,
                        compact: previewSettings.compact,
                        labels: {
                          welcomeTitle: previewSettings.welcomeTitle,
                          welcomeSubtitle: previewSettings.welcomeSubtitle,
                          askQuestionButton: 'Ask a question',
                          recentMessagesTitle: 'Recent messages',
                          noMessagesText: 'No messages yet. Start a conversation!',
                          messagePlaceholder: 'Type a message...',
                          headerTitle: previewSettings.headerTitle
                        },
                        features: {
                          typingIndicator: previewSettings.enableTypingIndicator,
                          reactions: previewSettings.enableReactions,
                          fileAttachments: previewSettings.enableFileAttachments,
                          readReceipts: previewSettings.enableReadReceipts
                        },
                        styles: {
                          fontFamily: previewSettings.fontFamily,
                          launcherStyle: previewSettings.launcherStyle
                        }
                      }}>
                        <SampleConversation 
                          onClose={handleToggleWidget}
                          position={previewSettings.position}
                          compact={previewSettings.compact}
                          headerTitle={previewSettings.headerTitle}
                          headerColor={previewSettings.headerColor}
                          currentView={currentView}
                          onChangeView={handleViewChange}
                          userMessageColor={previewSettings.userMessageColor}
                          agentMessageColor={previewSettings.agentMessageColor}
                          messageBoxColor={previewSettings.messageBoxColor}
                        />
                      </ThemeProvider>
                    </div>
                  )}
                </div>
              </DeviceFrame>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiveWidgetPreview;
