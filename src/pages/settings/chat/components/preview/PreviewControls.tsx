
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import PreviewBackground from './PreviewBackground';
import WidgetSettingsPopover from './WidgetSettingsPopover';
import ViewSelector from './ViewSelector';
import { Settings, Eye, EyeOff, Palette, MessageCircle, Layers } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ChatView = 'home' | 'messages' | 'conversation';

interface PreviewControlsProps {
  background: string;
  setBackground: (color: string) => void;
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
  settings: ChatWidgetSettings;
  previewSettings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
  onViewChange?: (view: ChatView) => void;
  currentView?: ChatView;
  onToggleWidget?: () => void;
  isWidgetOpen?: boolean;
}

const PreviewControls: React.FC<PreviewControlsProps> = ({
  background,
  setBackground,
  backgroundImage,
  setBackgroundImage,
  settings,
  previewSettings,
  onSettingChange,
  onViewChange,
  currentView = 'conversation',
  onToggleWidget,
  isWidgetOpen = true
}) => {
  // Function to reset preview settings to match original settings
  const handleResetChanges = () => {
    Object.keys(settings).forEach(key => {
      onSettingChange(key as keyof ChatWidgetSettings, settings[key as keyof ChatWidgetSettings]);
    });
  };

  return (
    <div className="border-b border-gray-200 bg-white p-3 flex items-center justify-between rounded-t-lg">
      <div className="flex items-center gap-2">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <PreviewBackground 
                  background={background} 
                  setBackground={setBackground}
                  backgroundImage={backgroundImage}
                  setBackgroundImage={setBackgroundImage}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Change preview background</p>
            </TooltipContent>
          </Tooltip>
        
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <WidgetSettingsPopover 
                  settings={previewSettings}
                  originalSettings={settings}
                  onSettingChange={onSettingChange}
                  onResetChanges={handleResetChanges}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Customize widget settings</p>
            </TooltipContent>
          </Tooltip>

          {onViewChange && currentView && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ViewSelector 
                    currentView={currentView} 
                    onViewChange={onViewChange} 
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Change widget view</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
      
      {onToggleWidget && (
        <Button 
          variant={isWidgetOpen ? "outline" : "default"}
          size="sm"
          onClick={onToggleWidget}
          className="flex items-center gap-1.5 transition-all duration-200 hover:shadow-sm"
        >
          {isWidgetOpen ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Hide Widget</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Show Widget</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default PreviewControls;
