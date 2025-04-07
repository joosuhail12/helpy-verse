
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { Save, Upload } from 'lucide-react';
import ChatWidgetPreview from './ChatWidgetPreview';
import { PositionOffsetControls } from '@/components/settings/chat/PositionOffsetControls';
import { Switch } from '@/components/ui/switch';

const BrandingSettings = () => {
  const { primaryColor, setPrimaryColor } = useTheme();
  
  // Color settings
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [textColor, setTextColor] = useState('#1F2937');
  const [userMessageBackground, setUserMessageBackground] = useState('#EEF2FF');
  const [agentMessageBackground, setAgentMessageBackground] = useState('#F3F4F6');
  
  // Text labels
  const [widgetName, setWidgetName] = useState('Chat Support');
  const [welcomeTitle, setWelcomeTitle] = useState('Chat Support');
  const [welcomeSubtitle, setWelcomeSubtitle] = useState('We\'re here to help');
  const [askQuestionButton, setAskQuestionButton] = useState('Ask a question');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi there! 👋 How can I help you today?');
  
  // Assets
  const [headerLogo, setHeaderLogo] = useState<string | null>(null);
  const [headerLogoFile, setHeaderLogoFile] = useState<File | null>(null);
  const [launcherIcon, setLauncherIcon] = useState<string | null>(null);
  const [launcherIconFile, setLauncherIconFile] = useState<File | null>(null);
  
  // Layout settings
  const [widgetPosition, setWidgetPosition] = useState<'left' | 'right'>('right');
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [compactMode, setCompactMode] = useState(false);

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your branding settings have been updated successfully",
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'header' | 'launcher') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo image must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Logo must be PNG, JPEG, or SVG",
        variant: "destructive",
      });
      return;
    }

    if (type === 'header') {
      setHeaderLogoFile(file);
    } else {
      setLauncherIconFile(file);
    }
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'header') {
        setHeaderLogo(reader.result as string);
      } else {
        setLauncherIcon(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-lg font-medium">Widget Appearance</h2>
        
        {/* Colors Section */}
        <div className="space-y-4">
          <h3 className="text-base font-medium">Colors</h3>
          
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input 
                id="primaryColor" 
                type="color" 
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input 
                type="text" 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-sm text-muted-foreground">This color will be used for the chat header and buttons.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex gap-2">
              <Input 
                id="backgroundColor" 
                type="color" 
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input 
                type="text" 
                value={backgroundColor} 
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-sm text-muted-foreground">Main background color for the chat widget.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex gap-2">
              <Input 
                id="textColor" 
                type="color" 
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input 
                type="text" 
                value={textColor} 
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-sm text-muted-foreground">The primary text color used throughout the widget.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userMessageBackground">User Message Background</Label>
            <div className="flex gap-2">
              <Input 
                id="userMessageBackground" 
                type="color" 
                value={userMessageBackground}
                onChange={(e) => setUserMessageBackground(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input 
                type="text" 
                value={userMessageBackground} 
                onChange={(e) => setUserMessageBackground(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-sm text-muted-foreground">Background color for the user's messages.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agentMessageBackground">Agent Message Background</Label>
            <div className="flex gap-2">
              <Input 
                id="agentMessageBackground" 
                type="color" 
                value={agentMessageBackground}
                onChange={(e) => setAgentMessageBackground(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input 
                type="text" 
                value={agentMessageBackground} 
                onChange={(e) => setAgentMessageBackground(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-sm text-muted-foreground">Background color for the agent's messages.</p>
          </div>
        </div>

        <Separator />

        {/* Brand Assets */}
        <div className="space-y-4">
          <h3 className="text-base font-medium">Brand Assets</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="headerLogo">Header Logo</Label>
              <div className="border rounded-md p-4 flex flex-col items-center justify-center space-y-3 h-40">
                {headerLogo ? (
                  <div className="h-20 w-full flex justify-center mb-2">
                    <img src={headerLogo} alt="Header logo preview" className="h-full object-contain" />
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <Label 
                  htmlFor="header-logo-upload" 
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm"
                >
                  Select File
                </Label>
                <Input 
                  id="header-logo-upload" 
                  type="file" 
                  onChange={(e) => handleLogoChange(e, 'header')}
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden" 
                />
                <p className="text-xs text-gray-500 text-center">This logo will appear in the chat header</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="launcherIcon">Launcher Icon</Label>
              <div className="border rounded-md p-4 flex flex-col items-center justify-center space-y-3 h-40">
                {launcherIcon ? (
                  <div className="h-20 w-full flex justify-center mb-2">
                    <img src={launcherIcon} alt="Launcher icon preview" className="h-full object-contain" />
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <Label 
                  htmlFor="launcher-icon-upload" 
                  className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm"
                >
                  Select File
                </Label>
                <Input 
                  id="launcher-icon-upload" 
                  type="file" 
                  onChange={(e) => handleLogoChange(e, 'launcher')}
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden" 
                />
                <p className="text-xs text-gray-500 text-center">This icon will appear on the chat launcher button</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Layout Section */}
        <div className="space-y-4">
          <h3 className="text-base font-medium">Layout</h3>

          <div className="space-y-2">
            <Label htmlFor="widgetPosition">Widget Position</Label>
            <RadioGroup 
              id="widgetPosition" 
              value={widgetPosition} 
              onValueChange={(value) => setWidgetPosition(value as 'left' | 'right')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="position-left" />
                <Label htmlFor="position-left">Left</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="position-right" />
                <Label htmlFor="position-right">Right</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">The side of the screen where the chat widget will appear.</p>
          </div>

          <div className="space-y-2">
            <Label>Position Offset</Label>
            <PositionOffsetControls 
              offsetX={offsetX}
              offsetY={offsetY}
              onOffsetXChange={setOffsetX}
              onOffsetYChange={setOffsetY}
            />
            <p className="text-sm text-muted-foreground">Adjust the position of the chat launcher from its default position.</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="compactMode" className="block text-sm font-medium">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Reduces the widget width for smaller screens</p>
            </div>
            <Switch 
              id="compactMode" 
              checked={compactMode} 
              onCheckedChange={setCompactMode}
            />
          </div>
        </div>

        <Separator />

        {/* Text Labels */}
        <div className="space-y-4">
          <h3 className="text-base font-medium">Text Labels</h3>

          <div className="space-y-2">
            <Label htmlFor="welcomeTitle">Welcome Title</Label>
            <Input 
              id="welcomeTitle" 
              value={welcomeTitle}
              onChange={(e) => setWelcomeTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcomeSubtitle">Welcome Subtitle</Label>
            <Input 
              id="welcomeSubtitle" 
              value={welcomeSubtitle}
              onChange={(e) => setWelcomeSubtitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="askQuestionButton">Ask Question Button</Label>
            <Input 
              id="askQuestionButton" 
              value={askQuestionButton}
              onChange={(e) => setAskQuestionButton(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Welcome Message</Label>
            <Textarea 
              id="welcomeMessage" 
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">This message will be displayed when a user opens the chat.</p>
          </div>
        </div>
        
        <div className="pt-4">
          <Button onClick={handleSaveChanges} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Preview</h2>
        <div className="border rounded-lg p-4 bg-gray-50">
          <ChatWidgetPreview 
            welcomeMessage={welcomeMessage}
            welcomeTitle={welcomeTitle}
            welcomeSubtitle={welcomeSubtitle}
            askQuestionButton={askQuestionButton}
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            textColor={textColor}
            userMessageBackground={userMessageBackground}
            agentMessageBackground={agentMessageBackground}
            headerLogo={headerLogo}
            position={widgetPosition}
            compactMode={compactMode}
          />
        </div>
        <p className="text-sm text-gray-500">This is a preview of how your chat widget will appear to users.</p>
      </div>
    </div>
  );
};

export default BrandingSettings;
