
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import ConnectedChatWidget from '@/components/chat-widget/ConnectedChatWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ThemeProvider } from '@/context/ThemeContext';
import DeviceFrame from './preview/DeviceFrame';
import ResponsiveControls from './preview/ResponsiveControls';
import { DeviceType, Orientation, ChatView } from '@/types/preview';
import SampleConversation from '@/components/chat-widget/components/conversation/SampleConversation';

interface LiveWidgetPreviewProps {
  settings: ChatWidgetSettings;
  currentView: ChatView;
  onViewChange: (view: ChatView) => void;
}

/**
 * Streamlined live preview of the chat widget that shows the actual widget with current settings
 */
const LiveWidgetPreview: React.FC<LiveWidgetPreviewProps> = ({ 
  settings,
  currentView,
  onViewChange
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('iphone');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [chatWidgetOpen, setChatWidgetOpen] = useState<boolean>(true);
  const [background, setBackground] = useState<string>('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  const handleToggleWidget = () => {
    setChatWidgetOpen(!chatWidgetOpen);
  };

  return (
    <Card className="h-full overflow-hidden border shadow-md">
      <CardHeader className="pb-3 pt-4 border-b bg-gradient-to-b from-white to-gray-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Widget Preview
            <Badge variant="outline" className="ml-2 font-normal text-xs bg-purple-50 text-purple-700 border-purple-200">
              Live
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
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
                workspaceId="preview-workspace-id" 
                isPreview={true}
                showLauncher={true}
                sampleMessages={true}
                previewSettings={settings}
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
              className="h-[520px] flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100"
            >
              <DeviceFrame 
                deviceType={deviceType} 
                className={orientation === 'landscape' ? 'transform -rotate-90 scale-75' : ''}
              >
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
                    <div className="absolute bottom-8 right-6">
                      <button
                        onClick={handleToggleWidget}
                        className={`${settings.launcherStyle === 'rectangle' ? 'rounded-lg px-3 py-2' : 'rounded-full w-14 h-14'} flex items-center justify-center shadow-lg transition-transform hover:scale-105 animate-pulse`}
                        style={{ backgroundColor: settings.primaryColor }}
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
                          primary: settings.primaryColor,
                          primaryForeground: '#ffffff',
                          background: '#ffffff',
                          backgroundSecondary: '#f9f9f9',
                          foreground: '#1A1F2C',
                          border: '#eaeaea',
                          userMessage: settings.userMessageColor,
                          userMessageText: '#ffffff',
                          agentMessage: settings.agentMessageColor,
                          agentMessageText: '#1A1F2C',
                          inputBackground: settings.messageBoxColor,
                          headerBackground: settings.headerColor
                        },
                        position: settings.position,
                        compact: settings.compact,
                        labels: {
                          welcomeTitle: settings.welcomeTitle,
                          welcomeSubtitle: settings.welcomeSubtitle,
                          askQuestionButton: 'Ask a question',
                          recentMessagesTitle: 'Recent messages',
                          noMessagesText: 'No messages yet. Start a conversation!',
                          messagePlaceholder: 'Type a message...',
                          headerTitle: settings.headerTitle
                        },
                        features: {
                          typingIndicator: settings.enableTypingIndicator,
                          reactions: settings.enableReactions,
                          fileAttachments: settings.enableFileAttachments,
                          readReceipts: settings.enableReadReceipts
                        },
                        styles: {
                          fontFamily: settings.fontFamily,
                          launcherStyle: settings.launcherStyle
                        }
                      }}>
                        <SampleConversation 
                          onClose={handleToggleWidget}
                          position={settings.position}
                          compact={settings.compact}
                          headerTitle={settings.headerTitle}
                          headerColor={settings.headerColor}
                          currentView={currentView}
                          onChangeView={onViewChange}
                          userMessageColor={settings.userMessageColor}
                          agentMessageColor={settings.agentMessageColor}
                          messageBoxColor={settings.messageBoxColor}
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
