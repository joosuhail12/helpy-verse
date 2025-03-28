import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Code, MessageSquare, Globe, SettingsIcon, Palette } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/components/ui/use-toast';

const ChatSettings = () => {
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState('appearance');
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    primaryColor: '#9b87f5',
    welcomeTitle: 'Hello there.',
    welcomeSubtitle: 'How can we help?',
    position: 'right',
    compact: false,
    enableTypingIndicator: true,
    enableReactions: true,
    enableFileAttachments: true,
    enableReadReceipts: true
  });

  const handleChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your chat widget settings have been saved successfully.",
    });
  };

  const getEmbedCode = () => {
    return `<script>
  (function() {
    window.PULLSE_WORKSPACE_ID = '${window.location.hostname}';
    window.PULLSE_THEME_COLORS = {
      primary: '${settings.primaryColor}'
    };
    window.PULLSE_POSITION = '${settings.position}';
    window.PULLSE_COMPACT = ${settings.compact};
    window.PULLSE_LABELS = {
      welcomeTitle: '${settings.welcomeTitle}',
      welcomeSubtitle: '${settings.welcomeSubtitle}'
    };
    window.PULLSE_FEATURES = {
      typingIndicator: ${settings.enableTypingIndicator},
      reactions: ${settings.enableReactions},
      fileAttachments: ${settings.enableFileAttachments},
      readReceipts: ${settings.enableReadReceipts}
    };
    
    const script = document.createElement('script');
    script.src = "${window.location.origin}/chat-widget.js";
    script.async = true;
    document.body.appendChild(script);
  })();
</script>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderColorPicker = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="primary-color">Primary Color</Label>
        <div className="flex space-x-2 items-center">
          <Input 
            id="primary-color" 
            type="text" 
            value={settings.primaryColor} 
            onChange={(e) => handleChange('primaryColor', e.target.value)} 
          />
          <div 
            className="w-8 h-8 rounded-md border border-gray-300"
            style={{ backgroundColor: settings.primaryColor }}
          />
          <Input 
            type="color" 
            value={settings.primaryColor} 
            onChange={(e) => handleChange('primaryColor', e.target.value)} 
            className="w-12 h-8 p-0 border-0"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chat Widget Settings</h1>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Configure Your Chat Widget</CardTitle>
              <CardDescription>
                Customize how your chat widget appears and behaves on your website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="appearance" value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span>Appearance</span>
                  </TabsTrigger>
                  <TabsTrigger value="behavior" className="flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4" />
                    <span>Behavior</span>
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </TabsTrigger>
                  <TabsTrigger value="installation" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span>Installation</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appearance" className="space-y-6">
                  {renderColorPicker()}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Widget Position</Label>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="position-right"
                            name="position"
                            checked={settings.position === 'right'}
                            onChange={() => handleChange('position', 'right')}
                            className="form-radio"
                          />
                          <Label htmlFor="position-right">Right</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="position-left"
                            name="position"
                            checked={settings.position === 'left'}
                            onChange={() => handleChange('position', 'left')}
                            className="form-radio"
                          />
                          <Label htmlFor="position-left">Left</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <Switch
                        id="compact-mode"
                        checked={settings.compact}
                        onCheckedChange={(checked) => handleChange('compact', checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="behavior" className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="typing-indicator">Typing Indicator</Label>
                      <p className="text-sm text-gray-500">Show when agents are typing</p>
                    </div>
                    <Switch
                      id="typing-indicator"
                      checked={settings.enableTypingIndicator}
                      onCheckedChange={(checked) => handleChange('enableTypingIndicator', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="reactions">Reactions</Label>
                      <p className="text-sm text-gray-500">Allow users to react to messages</p>
                    </div>
                    <Switch
                      id="reactions"
                      checked={settings.enableReactions}
                      onCheckedChange={(checked) => handleChange('enableReactions', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="file-attachments">File Attachments</Label>
                      <p className="text-sm text-gray-500">Allow users to upload files</p>
                    </div>
                    <Switch
                      id="file-attachments"
                      checked={settings.enableFileAttachments}
                      onCheckedChange={(checked) => handleChange('enableFileAttachments', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <Label htmlFor="read-receipts">Read Receipts</Label>
                      <p className="text-sm text-gray-500">Show when messages have been read</p>
                    </div>
                    <Switch
                      id="read-receipts"
                      checked={settings.enableReadReceipts}
                      onCheckedChange={(checked) => handleChange('enableReadReceipts', checked)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="messages" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcome-title">Welcome Title</Label>
                    <Input
                      id="welcome-title"
                      value={settings.welcomeTitle}
                      onChange={(e) => handleChange('welcomeTitle', e.target.value)}
                      placeholder="Hello there."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="welcome-subtitle">Welcome Subtitle</Label>
                    <Input
                      id="welcome-subtitle"
                      value={settings.welcomeSubtitle}
                      onChange={(e) => handleChange('welcomeSubtitle', e.target.value)}
                      placeholder="How can we help?"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="installation" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Installation Code</Label>
                    <div className="relative">
                      <Textarea
                        value={getEmbedCode()}
                        readOnly
                        rows={12}
                        className="font-mono text-sm"
                      />
                      <Button
                        onClick={handleCopyCode}
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="ml-2">{copied ? 'Copied' : 'Copy'}</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h3 className="font-medium text-amber-900 flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Installation Instructions
                    </h3>
                    <p className="text-sm text-amber-800 mt-2">
                      Add this code to your website's HTML, just before the closing &lt;/body&gt; tag.
                      Once added, the chat widget will appear on all pages of your website.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Widget Preview</CardTitle>
              <CardDescription>See how your chat widget will appear</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <div className="relative w-64 h-80 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md">
                <div className="h-12 bg-purple-600" style={{ backgroundColor: settings.primaryColor }}>
                  <div className="flex items-center h-full px-4">
                    <span className="text-white font-medium">Chat with us</span>
                  </div>
                </div>
                <div className="p-4 h-full bg-gray-50 flex flex-col">
                  <div className="flex-1 overflow-auto">
                    <div className="mb-4 p-3 bg-gray-100 rounded-lg max-w-[80%]">
                      <p className="text-sm font-bold">{settings.welcomeTitle}</p>
                      <p className="text-sm text-gray-600">{settings.welcomeSubtitle}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex border rounded-full bg-white p-1">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-3 bg-transparent border-none focus:outline-none text-sm"
                        readOnly
                      />
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: settings.primaryColor }}
                      >
                        <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11h2v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div 
                  className={`absolute ${settings.position === 'right' ? 'right-3' : 'left-3'} -bottom-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg`}
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Help & Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Installation guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Customization options
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Troubleshooting
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;
