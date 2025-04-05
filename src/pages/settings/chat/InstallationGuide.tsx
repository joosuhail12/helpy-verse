
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Code, Check, Clipboard, Copy, ExternalLink } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const InstallationGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('script');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const websiteScript = `<script src="https://cdn.example.com/chat-widget.js" async></script>
<script>
  window.onload = function() {
    initChatWidget({
      apiKey: "YOUR_API_KEY",
      organizationId: "YOUR_ORG_ID"
    });
  }
</script>`;

  const reactExample = `import React from 'react';
import { ChatWidget } from '@yourcompany/chat-widget-react';

export default function YourComponent() {
  return (
    <div>
      <h1>Your Website</h1>
      <ChatWidget 
        apiKey="YOUR_API_KEY"
        organizationId="YOUR_ORG_ID" 
      />
    </div>
  );
}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-4">Installation Instructions</h2>
        <Alert className="mb-6">
          <AlertDescription>
            You need to install the chat widget on your website to start accepting customer inquiries.
            Choose the installation method that works best for your website.
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="script">Script Tag</TabsTrigger>
            <TabsTrigger value="react">React Component</TabsTrigger>
            <TabsTrigger value="wordpress">WordPress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="script" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Copy this code into your website HTML</h3>
              <p className="text-sm text-muted-foreground">
                Add this script right before the closing </code>{`</body>`}</code> tag of your website.
              </p>
              
              <div className="relative">
                <div className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto text-sm">
                  <pre><code>{websiteScript}</code></pre>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(websiteScript, 'script')}
                >
                  {copied === 'script' ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <h3 className="text-sm font-medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Make sure to replace <code className="bg-gray-100 px-1 rounded">YOUR_API_KEY</code> and <code className="bg-gray-100 px-1 rounded">YOUR_ORG_ID</code> with your actual values.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="react" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Install the package</h3>
              <div className="bg-gray-900 text-gray-100 rounded-md p-3 overflow-x-auto">
                <code>npm install @yourcompany/chat-widget-react</code>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-medium">Add to your React component</h3>
              <div className="relative">
                <div className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto text-sm">
                  <pre><code>{reactExample}</code></pre>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(reactExample, 'react')}
                >
                  {copied === 'react' ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="wordpress" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">WordPress Plugin</h3>
              <p className="text-sm text-muted-foreground">
                Install our WordPress plugin for easy integration with your WordPress site.
              </p>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Option 1: Install from WordPress Plugin Directory</h4>
                  <ol className="list-decimal list-inside text-sm space-y-2">
                    <li>Go to your WordPress admin dashboard</li>
                    <li>Navigate to Plugins > Add New</li>
                    <li>Search for "YourCompany Chat Widget"</li>
                    <li>Click "Install Now" and then "Activate"</li>
                    <li>Navigate to Settings > Chat Widget to configure</li>
                  </ol>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Option 2: Manual Installation</h4>
                  <ol className="list-decimal list-inside text-sm space-y-2">
                    <li>Download the plugin from our website</li>
                    <li>Upload the plugin files to the <code className="bg-gray-100 px-1 rounded">/wp-content/plugins/</code> directory</li>
                    <li>Activate the plugin through the 'Plugins' menu in WordPress</li>
                    <li>Navigate to Settings > Chat Widget to configure</li>
                  </ol>
                  <Button className="mt-4" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Download Plugin
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Need Help?</h2>
        <p className="text-sm text-muted-foreground">
          If you're having trouble installing the chat widget, our support team is here to help.
        </p>
        <div className="flex gap-4">
          <Button variant="outline">
            View Documentation
          </Button>
          <Button>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallationGuide;
