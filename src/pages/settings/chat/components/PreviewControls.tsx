
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Image, PaintBucket } from 'lucide-react';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
  onSettingChange: (field: string, value: any) => void;
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
              
              <div data-value="color" className="space-y-2">
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
              </div>
              
              <div data-value="image" className="space-y-2">
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
              </div>
            </Tabs>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Settings size={14} />
              Test Settings
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3">
            <h3 className="font-medium mb-2">Test settings without saving</h3>
            <div className="space-y-3">
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
                <Label>Position</Label>
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
                <Label htmlFor="welcome-title">Welcome Title</Label>
                <Input
                  id="welcome-title"
                  value={previewSettings.welcomeTitle}
                  onChange={(e) => onSettingChange('welcomeTitle', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="welcome-subtitle">Welcome Subtitle</Label>
                <Input
                  id="welcome-subtitle"
                  value={previewSettings.welcomeSubtitle}
                  onChange={(e) => onSettingChange('welcomeSubtitle', e.target.value)}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => onSettingChange('compact', !previewSettings.compact)}
              >
                {previewSettings.compact ? 'Switch to Full Size' : 'Switch to Compact Mode'}
              </Button>
              
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={() => {
                  // Reset preview settings to match the actual settings
                  Object.keys(settings).forEach(key => {
                    onSettingChange(key, settings[key as keyof ChatWidgetSettings]);
                  });
                }}
              >
                Reset Changes
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PreviewControls;
