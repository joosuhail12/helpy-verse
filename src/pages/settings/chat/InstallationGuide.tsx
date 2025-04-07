
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const InstallationGuide: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  
  // This would be generated on the backend in a real app
  const chatWidgetCode = `<!-- Customer Engagement Platform Chat Widget -->
<script>
  (function(d, w) {
    var s = d.createElement('script');
    s.async = true;
    s.src = 'https://cdn.example.com/engagement-platform/chat-widget.js';
    s.setAttribute('data-widget-id', 'YOUR_WIDGET_ID');
    var m = d.getElementsByTagName('script')[0];
    m.parentNode.insertBefore(s, m);
  })(document, window);
</script>`;

  const gtmCode = `// Google Tag Manager Installation
dataLayer.push({
  'event': 'chatWidgetInstall',
  'widgetId': 'YOUR_WIDGET_ID'
});`;

  const segmentCode = `// Segment.io Installation
analytics.track('Chat Widget Installed', {
  widgetId: 'YOUR_WIDGET_ID'
});`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      toast({
        title: "Copied to clipboard",
        description: "Installation code copied successfully",
      });
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium mb-2">Website Installation</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Add the chat widget to your website by following these instructions. Copy the code snippet and add it to your website's HTML just before the closing &lt;/body&gt; tag.
        </p>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Installation Code</CardTitle>
            <CardDescription>
              Copy and paste this code into your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono">
                {chatWidgetCode}
              </pre>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(chatWidgetCode, 'default')}
              >
                {copied === 'default' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-2">Integration Options</h2>
        <p className="text-sm text-muted-foreground mb-6">
          If you use other marketing tools, you can integrate the chat widget with them using these code snippets.
        </p>
        
        <Tabs defaultValue="gtm">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="gtm">Google Tag Manager</TabsTrigger>
            <TabsTrigger value="segment">Segment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gtm">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Google Tag Manager Integration</CardTitle>
                <CardDescription>
                  Use this code to install the chat widget via GTM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono">
                    {gtmCode}
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(gtmCode, 'gtm')}
                  >
                    {copied === 'gtm' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="segment">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Segment.io Integration</CardTitle>
                <CardDescription>
                  Use this code to install the chat widget via Segment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono">
                    {segmentCode}
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(segmentCode, 'segment')}
                  >
                    {copied === 'segment' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-2">Troubleshooting</h2>
        <p className="text-sm text-muted-foreground">
          If you experience any issues with the installation, please check the following:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
          <li>Ensure the script is placed just before the closing &lt;/body&gt; tag</li>
          <li>Verify your widget ID is correctly entered in the code</li>
          <li>Check your browser console for any errors</li>
          <li>Ensure your website allows third-party scripts</li>
        </ul>
      </div>
    </div>
  );
};

export default InstallationGuide;
