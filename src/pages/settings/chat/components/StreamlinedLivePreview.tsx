
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/redux';
import { selectChatWidgetSettings } from '@/store/slices/chatWidgetSettings';
import ConnectedChatWidget from '@/components/chat-widget/ConnectedChatWidget';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import SampleConversation from '@/components/chat-widget/components/conversation/SampleConversation';
import StreamlinedPreviewControls from './preview/StreamlinedPreviewControls';

type ChatView = 'home' | 'messages' | 'conversation';

/**
 * Streamlined live preview of the chat widget that shows the actual widget with current settings
 */
const StreamlinedLivePreview = () => {
  const settings = useAppSelector(selectChatWidgetSettings);
  const [background, setBackground] = useState<string>('#ffffff');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [previewSettings, setPreviewSettings] = useState<ChatWidgetSettings>(settings);
  const [refreshPreview, setRefreshPreview] = useState<number>(Date.now());
  const [showSideBySidePreview, setShowSideBySidePreview] = useState<boolean>(false);
  const [chatWidgetOpen, setChatWidgetOpen] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<ChatView>('conversation');
  
  // Update preview settings when redux settings change
  useEffect(() => {
    setPreviewSettings(settings);
  }, [settings]);
  
  // Handle real-time setting changes without saving
  const handlePreviewSettingChange = (field: keyof ChatWidgetSettings, value: any) => {
    setPreviewSettings(prev => {
      const newSettings = {
        ...prev,
        [field]: value
      };
      
      // Force a refresh of the preview when settings change
      setRefreshPreview(Date.now());
      return newSettings;
    });
  };

  const handleChangeView = (view: ChatView) => {
    setCurrentView(view);
  };
  
  const handleToggleWidget = () => {
    setChatWidgetOpen(!chatWidgetOpen);
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Widget Preview</CardTitle>
            <CardDescription>See how your chat widget will appear</CardDescription>
          </div>
          <div>
            <button
              onClick={() => setShowSideBySidePreview(!showSideBySidePreview)}
              className={`px-3 py-1 text-sm rounded border ${showSideBySidePreview ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              {showSideBySidePreview ? 'Standard Preview' : 'Advanced Preview'}
            </button>
          </div>
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
          onViewChange={handleChangeView}
          currentView={currentView}
          onToggleWidget={handleToggleWidget}
          isWidgetOpen={chatWidgetOpen}
        />

        {showSideBySidePreview ? (
          <div className="grid grid-cols-2 gap-4 h-[600px] p-4 border-t border-gray-200">
            <div 
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md relative"
              style={{ 
                backgroundColor: background,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="h-full flex items-center justify-center">
                {!chatWidgetOpen ? (
                  <button
                    onClick={handleToggleWidget}
                    className={`${previewSettings.launcherStyle === 'rectangle' ? 'rounded-lg px-3 py-2' : 'rounded-full w-14 h-14'} flex items-center justify-center shadow-lg transition-colors`}
                    style={{ backgroundColor: previewSettings.primaryColor }}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                ) : (
                  <div className="w-full h-full max-w-sm">
                    <SampleConversation 
                      onClose={handleToggleWidget}
                      position={previewSettings.position}
                      compact={previewSettings.compact}
                      headerTitle={previewSettings.headerTitle}
                      headerColor={previewSettings.headerColor}
                      currentView={currentView}
                      onChangeView={handleChangeView}
                      userMessageColor={previewSettings.userMessageColor}
                      agentMessageColor={previewSettings.agentMessageColor}
                      messageBoxColor={previewSettings.messageBoxColor}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-100 p-3 border-b">
                <h3 className="font-medium">Mobile View</h3>
              </div>
              <div className="relative h-[calc(100%-48px)] w-full max-w-[375px] mx-auto bg-gray-100 overflow-hidden">
                <div className="h-full w-full bg-white border-l border-r border-gray-300 overflow-hidden">
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
                          onChangeView={handleChangeView}
                          userMessageColor={previewSettings.userMessageColor}
                          agentMessageColor={previewSettings.agentMessageColor}
                          messageBoxColor={previewSettings.messageBoxColor}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
              key={refreshPreview} // Force re-render when settings change
              workspaceId="preview-workspace-id" 
              isPreview={true}
              showLauncher={true}
              sampleMessages={true}
              previewSettings={previewSettings}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreamlinedLivePreview;
