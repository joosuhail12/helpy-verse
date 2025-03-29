
import React from 'react';
import { themePresets, ThemePreset } from './ThemePresets';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Check, Paintbrush } from 'lucide-react';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemePresetSelectorProps {
  settings: ChatWidgetSettings;
  onApplyTheme: (theme: ThemePreset) => void;
}

const ThemePresetSelector: React.FC<ThemePresetSelectorProps> = ({ 
  settings, 
  onApplyTheme 
}) => {
  // Check if current settings match a preset
  const isCurrentTheme = (theme: ThemePreset): boolean => {
    return (
      theme.colors.primaryColor === settings.primaryColor &&
      theme.colors.headerColor === settings.headerColor &&
      theme.colors.messageBoxColor === settings.messageBoxColor &&
      theme.colors.userMessageColor === settings.userMessageColor &&
      theme.colors.agentMessageColor === settings.agentMessageColor
    );
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Color Themes</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Paintbrush className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Theme presets info</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-xs max-w-[200px]">Click a theme to apply its colors to your chat widget</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <ScrollArea className="h-24 w-full rounded-md border">
        <div className="flex gap-2 p-2">
          {themePresets.map((theme, index) => (
            <button
              key={index}
              onClick={() => onApplyTheme(theme)}
              className="relative flex-none group"
            >
              <div className="flex flex-col items-center space-y-1.5">
                <div 
                  className={`w-16 h-16 rounded-md border-2 transition-all overflow-hidden flex flex-col ${isCurrentTheme(theme) ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'}`}
                >
                  <div style={{ backgroundColor: theme.colors.headerColor }} className="h-1/4" />
                  <div style={{ backgroundColor: '#ffffff' }} className="flex-1 p-1">
                    <div style={{ backgroundColor: theme.colors.agentMessageColor }} className="w-9 h-2 rounded-full mb-1" />
                    <div style={{ backgroundColor: theme.colors.userMessageColor }} className="w-7 h-2 rounded-full ml-auto" />
                  </div>
                </div>
                <span className="text-xs whitespace-nowrap max-w-16 truncate" title={theme.name}>
                  {theme.name}
                </span>
                {isCurrentTheme(theme) && (
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ThemePresetSelector;
