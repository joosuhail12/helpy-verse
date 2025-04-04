
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Copy, Check } from 'lucide-react';

const InstallationGuide: React.FC = () => {
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({
    script: false,
    npm: false,
    react: false,
  });
  
  // Example workspace ID - in a real app, this would be fetched from the backend
  const workspaceId = "your-workspace-id";
  
  const scriptInstallCode = `<script>
  (function(w, d, s, o) {
    w.ChatWidgetApi = o;
    w[o] = w[o] || function() {
      (w[o].q = w[o].q || []).push(arguments);
    };
    var js = d.createElement(s);
    js.id = o + '-script';
    js.async = 1;
    js.src = 'https://cdn.chatwidget.com/widget-latest.js';
    d.head.appendChild(js);
  })(window, document, 'script', 'ChatWidget');

  window.ChatWidget.init({
    workspaceId: '${workspaceId}',
  });
</script>`;

  const npmInstallCode = `npm install @chatwidget/react`;

  const reactImportCode = `import { ChatWidget } from '@chatwidget/react';

function App() {
  return (
    <div className="App">
      <ChatWidget workspaceId="${workspaceId}" />
    </div>
  );
}`;

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied({ ...copied, [type]: true });
      toast({
        title: "Copied to clipboard",
        description: "You can now paste the code into your website or application.",
      });
      
      setTimeout(() => {
        setCopied({ ...copied, [type]: false });
      }, 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-lg font-medium mb-4">Installation Instructions</h2>
        
        <Tabs defaultValue="script">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="script">Script Tag</TabsTrigger>
            <TabsTrigger value="npm">NPM Package</TabsTrigger>
            <TabsTrigger value="react">React Component</TabsTrigger>
          </TabsList>
          
          <TabsContent value="script" className="space-y-4">
            <p>
              Add this script to the <code>&lt;head&gt;</code> section of your HTML to install the chat widget:
            </p>
            
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <code>{scriptInstallCode}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(scriptInstallCode, 'script')}
              >
                {copied.script ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded">
              <p>
                <strong>Tip:</strong> Place the script tag in the <code>&lt;head&gt;</code> section of your HTML for optimal performance.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="npm" className="space-y-4">
            <p>
              Install the Chat Widget NPM package:
            </p>
            
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <code>{npmInstallCode}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(npmInstallCode, 'npm')}
              >
                {copied.npm ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <p>
              After installing, follow the React Component integration guide.
            </p>
          </TabsContent>
          
          <TabsContent value="react" className="space-y-4">
            <p>
              Import and use the ChatWidget component in your React application:
            </p>
            
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <code>{reactImportCode}</code>
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(reactImportCode, 'react')}
              >
                {copied.react ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-800 rounded">
              <p>
                <strong>Tip:</strong> The React component supports all the same configuration options as the script tag version. See documentation for advanced configuration options.
              </p>
            </div>

            <div className="pt-4">
              <Label htmlFor="workspace-id" className="mb-2 block">Your Workspace ID</Label>
              <div className="flex gap-2">
                <Input id="workspace-id" value={workspaceId} readOnly />
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(workspaceId, 'workspace')}
                  className="whitespace-nowrap"
                >
                  Copy ID
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-6 border-t">
          <h3 className="text-md font-medium mb-4">Need more help?</h3>
          <p className="mb-4">View our complete <a href="#" className="text-primary hover:underline">Chat Widget documentation</a> for more details on advanced customization options, events, and API methods.</p>
          <Button variant="outline" asChild>
            <a href="/docs/ChatWidgetTheme.md" target="_blank">Read Advanced Theming Guide</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallationGuide;
