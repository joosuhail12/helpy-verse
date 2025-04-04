
import React from 'react';
import { useThemeContext, ThemeConfig } from '@/context/ThemeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ChatWidgetPreview from './ChatWidgetPreview';
import ImageUploader from '@/components/settings/chat/ImageUploader';
import PositionOffsetControls from '@/components/settings/chat/PositionOffsetControls';

const BrandingSettings: React.FC = () => {
  const { colors, position, compact, labels, logo, launcherIcon, positionOffset, updateTheme } = useThemeContext();

  const handleColorChange = (colorKey: keyof ThemeConfig['colors'], value: string) => {
    updateTheme({
      colors: {
        ...colors, // Include all existing colors
        [colorKey]: value,
      },
    });
  };

  const handlePositionChange = (newPosition: 'left' | 'right') => {
    updateTheme({ position: newPosition });
  };

  const handleCompactChange = (isCompact: boolean) => {
    updateTheme({ compact: isCompact });
  };
  
  const handleLabelChange = (labelKey: keyof ThemeConfig['labels'], value: string) => {
    updateTheme({
      labels: {
        ...labels, // Include all existing labels
        [labelKey]: value,
      },
    });
  };

  const handleXOffsetChange = (value: number) => {
    updateTheme({
      positionOffset: {
        ...positionOffset,
        x: value
      }
    });
  };

  const handleYOffsetChange = (value: number) => {
    updateTheme({
      positionOffset: {
        ...positionOffset,
        y: value
      }
    });
  };

  const handleLogoChange = (image: string | null) => {
    updateTheme({ logo: image });
  };

  const handleIconChange = (image: string | null) => {
    updateTheme({ launcherIcon: image });
  };

  const handleSaveChanges = () => {
    // In a real implementation, we would save changes to the backend here
    toast({
      title: "Settings saved",
      description: "Your branding settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-lg font-medium">Colors</h2>
          <div className="grid grid-cols-1 gap-4">
            {/* Primary Color */}
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: colors.primary }}
                />
                <Input
                  id="primaryColor"
                  type="text"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            {/* Background Color */}
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: colors.background }}
                />
                <Input
                  id="backgroundColor"
                  type="text"
                  value={colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            {/* Text Color */}
            <div className="space-y-2">
              <Label htmlFor="foregroundColor">Text Color</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: colors.foreground }}
                />
                <Input
                  id="foregroundColor"
                  type="text"
                  value={colors.foreground}
                  onChange={(e) => handleColorChange('foreground', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* User Message Background */}
            <div className="space-y-2">
              <Label htmlFor="userMessageColor">User Message Background</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: colors.userMessage }}
                />
                <Input
                  id="userMessageColor"
                  type="text"
                  value={colors.userMessage}
                  onChange={(e) => handleColorChange('userMessage', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Agent Message Background */}
            <div className="space-y-2">
              <Label htmlFor="agentMessageColor">Agent Message Background</Label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: colors.agentMessage }}
                />
                <Input
                  id="agentMessageColor"
                  type="text"
                  value={colors.agentMessage}
                  onChange={(e) => handleColorChange('agentMessage', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <Separator />

          <h2 className="text-lg font-medium">Brand Assets</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Header Logo</Label>
              <ImageUploader 
                initialImage={logo}
                onImageChange={handleLogoChange}
                label="Upload Logo"
                previewHeight={40}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This logo will appear in the header of the chat widget
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Launcher Icon</Label>
              <ImageUploader 
                initialImage={launcherIcon}
                onImageChange={handleIconChange}
                label="Upload Icon"
                previewHeight={40}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This icon will appear on the chat launcher button
              </p>
            </div>
          </div>

          <Separator />

          <h2 className="text-lg font-medium">Layout</h2>
          <div className="space-y-4">
            {/* Widget Position */}
            <div className="flex items-center justify-between">
              <Label htmlFor="position">Widget Position</Label>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={position === 'left' ? 'default' : 'outline'}
                  onClick={() => handlePositionChange('left')}
                >
                  Left
                </Button>
                <Button
                  size="sm"
                  variant={position === 'right' ? 'default' : 'outline'}
                  onClick={() => handlePositionChange('right')}
                >
                  Right
                </Button>
              </div>
            </div>

            {/* Position Offsets */}
            <div className="space-y-2">
              <Label>Position Offset</Label>
              <div className="pl-2 border-l-2 border-gray-200">
                <PositionOffsetControls
                  xOffset={positionOffset.x}
                  yOffset={positionOffset.y}
                  onXChange={handleXOffsetChange}
                  onYChange={handleYOffsetChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Adjust the position of the chat launcher from its default position
              </p>
            </div>

            {/* Compact Mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Reduces the widget width for smaller screens</p>
              </div>
              <Switch
                id="compact"
                checked={compact}
                onCheckedChange={handleCompactChange}
              />
            </div>
          </div>

          <Separator />

          <h2 className="text-lg font-medium">Text Labels</h2>
          <div className="space-y-4">
            {/* Welcome Title */}
            <div className="space-y-2">
              <Label htmlFor="welcomeTitle">Welcome Title</Label>
              <Input
                id="welcomeTitle"
                value={labels.welcomeTitle}
                onChange={(e) => handleLabelChange('welcomeTitle', e.target.value)}
              />
            </div>
            
            {/* Welcome Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="welcomeSubtitle">Welcome Subtitle</Label>
              <Input
                id="welcomeSubtitle"
                value={labels.welcomeSubtitle}
                onChange={(e) => handleLabelChange('welcomeSubtitle', e.target.value)}
              />
            </div>
            
            {/* Ask Question Button */}
            <div className="space-y-2">
              <Label htmlFor="askQuestionButton">Ask Question Button</Label>
              <Input
                id="askQuestionButton"
                value={labels.askQuestionButton}
                onChange={(e) => handleLabelChange('askQuestionButton', e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-lg font-medium">Live Preview</h2>
          <div className="border rounded-lg p-4 bg-gray-50 h-[600px] relative">
            <ChatWidgetPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
