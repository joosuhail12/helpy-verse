
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';
import ChatWidgetPreview from './ChatWidgetPreview';

const BrandingSettings = () => {
  const { primaryColor, setPrimaryColor } = useTheme();
  const [widgetName, setWidgetName] = useState('Chat Support');
  const [welcomeMessage, setWelcomeMessage] = useState('Hi there! 👋 How can I help you today?');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your branding settings have been updated successfully",
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setLogoFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-lg font-medium">Widget Appearance</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="widgetName">Widget Name</Label>
            <Input 
              id="widgetName" 
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">This will be displayed in the chat header.</p>
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
            <Label htmlFor="logo">Logo</Label>
            <div className="flex items-center gap-2">
              {logo && (
                <div className="h-12 w-12 border rounded-md overflow-hidden">
                  <img src={logo} alt="Logo preview" className="h-full w-full object-contain" />
                </div>
              )}
              <Label 
                htmlFor="logo-upload" 
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm"
              >
                Choose file
              </Label>
              <Input 
                id="logo-upload" 
                type="file" 
                onChange={handleLogoChange}
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden" 
              />
              {logoFile && <span className="text-sm text-gray-500">{logoFile.name}</span>}
            </div>
            <p className="text-sm text-muted-foreground">Recommended size: 240x80px. Max file size: 2MB.</p>
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
            primaryColor={primaryColor}
          />
        </div>
        <p className="text-sm text-gray-500">This is a preview of how your chat widget will appear to users.</p>
      </div>
    </div>
  );
};

export default BrandingSettings;
