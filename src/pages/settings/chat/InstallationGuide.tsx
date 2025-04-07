
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clipboard, Code, Desktop, Globe, Server } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/context/ThemeContext';

const InstallationGuide: React.FC = () => {
  const { primaryColor } = useTheme();
  const [activeTab, setActiveTab] = React.useState('website');
  
  const handleCopyCode = (codeType: string) => {
    let code = '';
    
    switch (codeType) {
      case 'script':
        code = `<script src="https://widget.example.com/chat.js?id=YOUR_WIDGET_ID" async></script>`;
        break;
      case 'npm':
        code = `npm install @example/chat-widget\nimport { ChatWidget } from '@example/chat-widget';\n\n// Then in your component\n<ChatWidget id="YOUR_WIDGET_ID" />`;
        break;
      case 'api':
        code = `curl -X POST "https://api.example.com/v1/chat/message" \\\n-H "Authorization: Bearer YOUR_API_KEY" \\\n-H "Content-Type: application/json" \\\n-d '{"message": "Hello", "sessionId": "user123"}'`;
        break;
      default:
        code = '';
    }
    
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        toast({
          title: "Code copied",
          description: "The code snippet has been copied to your clipboard.",
        });
      });
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="website">
            <Globe className="h-4 w-4 mr-2" />
            Website
          </TabsTrigger>
          <TabsTrigger value="javascript">
            <Code className="h-4 w-4 mr-2" />
            JavaScript
          </TabsTrigger>
          <TabsTrigger value="api">
            <Server className="h-4 w-4 mr-2" />
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="website" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Add to your website</h3>
                <p className="text-sm text-muted-foreground">
                  Add the following script tag to your website to display the chat widget.
                </p>
              </div>

              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                  <code>{`<script src="https://widget.example.com/chat.js?id=YOUR_WIDGET_ID" async></script>`}</code>
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => handleCopyCode('script')}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="websiteUrl" 
                    placeholder="https://example.com" 
                    className="flex-1"
                  />
                  <Button>Add Domain</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add the domains where this chat widget will be allowed to run.
                </p>
              </div>

              <div className="border rounded-md p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Allowed Domains</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span>example.com</span>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span>app.example.com</span>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Desktop className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-base font-medium">Preview</h3>
              </div>
              <div className="mt-4 p-4 border rounded-md bg-gray-50">
                <p className="text-sm text-center">
                  This is how the chat widget button will appear on your website.
                </p>
                <div className="mt-4 relative h-[200px]">
                  <div className="absolute bottom-4 right-4 bg-primary text-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="javascript" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Use with JavaScript frameworks</h3>
                <p className="text-sm text-muted-foreground">
                  For React, Vue, Angular, or other JavaScript frameworks
                </p>
              </div>

              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                  <code>{`npm install @example/chat-widget

import { ChatWidget } from '@example/chat-widget';

// Then in your component
<ChatWidget id="YOUR_WIDGET_ID" />`}</code>
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => handleCopyCode('npm')}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                <h4 className="text-amber-800 font-medium">Configuration Options</h4>
                <p className="text-sm text-amber-700">
                  You can customize the widget appearance and behavior with the following props:
                </p>
                <ul className="text-sm text-amber-700 list-disc pl-5 mt-2 space-y-1">
                  <li>position: 'left' | 'right'</li>
                  <li>theme: 'light' | 'dark' | 'auto'</li>
                  <li>primaryColor: string (hex color)</li>
                  <li>showHeader: boolean</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Chat API Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Use our REST API to integrate chat functionality into your custom applications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="apiKey" 
                    value="sk_test_example_key_123456789ABCDEF" 
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Keep this key secret. Do not include it in client-side code.
                </p>
              </div>

              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                  <code>{`curl -X POST "https://api.example.com/v1/chat/message" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{"message": "Hello", "sessionId": "user123"}'`}</code>
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2" 
                  onClick={() => handleCopyCode('api')}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Documentation</h4>
                <p className="text-sm">
                  Refer to our API documentation for detailed endpoint information and examples.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary">
                  View API Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstallationGuide;
