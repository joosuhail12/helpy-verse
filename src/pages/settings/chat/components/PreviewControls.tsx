
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Settings, Image, PaintBucket, Layout, Type, MessageSquare } from 'lucide-react';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';

const backgroundImages = [
  { id: 'none', url: null, name: 'None' },
  { id: 'office', url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b', name: 'Office' },
  { id: 'laptop', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158', name: 'Laptop' },
  { id: 'tech', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', name: 'Tech' },
  { id: 'code', url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7', name: 'Code' }
];

interface PreviewControlsProps {
  background: string;
  setBackground: (color: string) => void;
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
  settings: ChatWidgetSettings;
  previewSettings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
}

const PreviewControls: React.FC<PreviewControlsProps> = ({
  background,
  setBackground,
  backgroundImage,
  setBackgroundImage,
  settings,
  previewSettings,
  onSettingChange
}) => {
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <div className="border-b border-gray-200 p-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <PaintBucket size={14} />
              Background
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <Tabs defaultValue="color">
              <TabsList className="mb-2 w-full">
                <TabsTrigger value="color" className="flex-1">Color</TabsTrigger>
                <TabsTrigger value="image" className="flex-1">Image</TabsTrigger>
              </TabsList>
              
              <TabsContent value="color" className="space-y-2">
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="bg-color" 
                    type="color" 
                    value={background} 
                    onChange={(e) => setBackground(e.target.value)} 
                    className="w-10 h-10 p-1 cursor-pointer" 
                  />
                  <Input
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="grid grid-cols-5 gap-1 mt-2">
                  {['#ffffff', '#f3f4f6', '#d1d5db', '#111827', '#000000'].map(color => (
                    <div 
                      key={color} 
                      className="w-full aspect-square rounded border border-gray-300 cursor-pointer" 
                      style={{ backgroundColor: color }}
                      onClick={() => setBackground(color)}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="image" className="space-y-2">
                <Label>Select Background Image</Label>
                <ScrollArea className="h-52">
                  <div className="grid grid-cols-2 gap-2">
                    {backgroundImages.map(img => (
                      <div 
                        key={img.id}
                        className={`relative aspect-video rounded overflow-hidden cursor-pointer border-2 ${backgroundImage === img.url ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => setBackgroundImage(img.url)}
                      >
                        {img.url ? (
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-sm">None</div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                          {img.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Settings size={14} />
              Widget Settings
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="appearance"><Layout className="h-4 w-4 mr-1" /> Layout</TabsTrigger>
                <TabsTrigger value="colors"><PaintBucket className="h-4 w-4 mr-1" /> Colors</TabsTrigger>
                <TabsTrigger value="features"><MessageSquare className="h-4 w-4 mr-1" /> Features</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appearance" className="space-y-4">
                <div className="space-y-2">
                  <Label>Widget Position</Label>
                  <ToggleGroup 
                    type="single" 
                    value={previewSettings.position}
                    onValueChange={(value) => value && onSettingChange('position', value)}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="left">Left</ToggleGroupItem>
                    <ToggleGroupItem value="right">Right</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Launcher Style</Label>
                  <ToggleGroup 
                    type="single" 
                    value={previewSettings.launcherStyle}
                    onValueChange={(value) => value && onSettingChange('launcherStyle', value)}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="circle">Circle</ToggleGroupItem>
                    <ToggleGroupItem value="rectangle">Rectangle</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <Switch
                    id="compact-mode"
                    checked={previewSettings.compact}
                    onCheckedChange={(value) => onSettingChange('compact', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="header-title">Header Title</Label>
                  <Input
                    id="header-title"
                    value={previewSettings.headerTitle}
                    onChange={(e) => onSettingChange('headerTitle', e.target.value)}
                    placeholder="Chat with us"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-family">Font Family</Label>
                  <Input
                    id="font-family"
                    value={previewSettings.fontFamily}
                    onChange={(e) => onSettingChange('fontFamily', e.target.value)}
                    placeholder="Inter, system-ui, sans-serif"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="colors" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="primary-color" 
                      type="color" 
                      value={previewSettings.primaryColor} 
                      onChange={(e) => onSettingChange('primaryColor', e.target.value)} 
                      className="w-10 h-10 p-1 cursor-pointer" 
                    />
                    <Input
                      value={previewSettings.primaryColor}
                      onChange={(e) => onSettingChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="header-color">Header Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="header-color" 
                      type="color" 
                      value={previewSettings.headerColor} 
                      onChange={(e) => onSettingChange('headerColor', e.target.value)} 
                      className="w-10 h-10 p-1 cursor-pointer" 
                    />
                    <Input
                      value={previewSettings.headerColor}
                      onChange={(e) => onSettingChange('headerColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message-box-color">Message Box Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="message-box-color" 
                      type="color" 
                      value={previewSettings.messageBoxColor} 
                      onChange={(e) => onSettingChange('messageBoxColor', e.target.value)} 
                      className="w-10 h-10 p-1 cursor-pointer" 
                    />
                    <Input
                      value={previewSettings.messageBoxColor}
                      onChange={(e) => onSettingChange('messageBoxColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="user-message-color">User Message Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="user-message-color" 
                      type="color" 
                      value={previewSettings.userMessageColor} 
                      onChange={(e) => onSettingChange('userMessageColor', e.target.value)} 
                      className="w-10 h-10 p-1 cursor-pointer" 
                    />
                    <Input
                      value={previewSettings.userMessageColor}
                      onChange={(e) => onSettingChange('userMessageColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agent-message-color">Agent Message Color</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="agent-message-color" 
                      type="color" 
                      value={previewSettings.agentMessageColor} 
                      onChange={(e) => onSettingChange('agentMessageColor', e.target.value)} 
                      className="w-10 h-10 p-1 cursor-pointer" 
                    />
                    <Input
                      value={previewSettings.agentMessageColor}
                      onChange={(e) => onSettingChange('agentMessageColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="welcome-title">Welcome Title</Label>
                  <Input
                    id="welcome-title"
                    value={previewSettings.welcomeTitle}
                    onChange={(e) => onSettingChange('welcomeTitle', e.target.value)}
                    placeholder="Hello there."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="welcome-subtitle">Welcome Subtitle</Label>
                  <Input
                    id="welcome-subtitle"
                    value={previewSettings.welcomeSubtitle}
                    onChange={(e) => onSettingChange('welcomeSubtitle', e.target.value)}
                    placeholder="How can we help?"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="typing-indicator">Show Typing Indicator</Label>
                  <Switch
                    id="typing-indicator"
                    checked={previewSettings.enableTypingIndicator}
                    onCheckedChange={(value) => onSettingChange('enableTypingIndicator', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="reactions">Enable Reactions</Label>
                  <Switch
                    id="reactions"
                    checked={previewSettings.enableReactions}
                    onCheckedChange={(value) => onSettingChange('enableReactions', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="file-attachments">Enable File Attachments</Label>
                  <Switch
                    id="file-attachments"
                    checked={previewSettings.enableFileAttachments}
                    onCheckedChange={(value) => onSettingChange('enableFileAttachments', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="read-receipts">Show Read Receipts</Label>
                  <Switch
                    id="read-receipts"
                    checked={previewSettings.enableReadReceipts}
                    onCheckedChange={(value) => onSettingChange('enableReadReceipts', value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={() => {
                  // Reset preview settings to match the actual settings
                  Object.keys(settings).forEach(key => {
                    onSettingChange(key as keyof ChatWidgetSettings, settings[key as keyof ChatWidgetSettings]);
                  });
                }}
              >
                Reset All Changes
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PreviewControls;
