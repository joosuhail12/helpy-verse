
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface DeploymentProps {
  onComplete: () => void;
}

export const Deployment = ({ onComplete }: DeploymentProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState('widget');

  const handleDeploy = () => {
    setIsDeploying(true);
    
    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deployment Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="widget" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="widget">Widget</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="embed">Embed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="widget" className="space-y-4">
              <div className="space-y-2">
                <Label>Widget Appearance</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-primary"></div>
                    <span>Bubble</span>
                  </div>
                  <div className="border rounded-md p-4 flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 rounded bg-primary"></div>
                    <span>Tab</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="widget-label">Widget Label</Label>
                <Input id="widget-label" placeholder="Chat with us" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="widget-color">Primary Color</Label>
                <div className="flex space-x-2">
                  <Input id="widget-color" value="#4F46E5" />
                  <div className="w-10 h-10 rounded bg-indigo-600 border"></div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm mb-2">API Endpoint:</p>
                <code className="block p-2 bg-gray-100 rounded">https://api.example.com/chatbots/[id]</code>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex space-x-2">
                  <Input id="api-key" value="sk_live_1a2b3c4d5e6f7g8h9i0j" type="password" />
                  <Button variant="outline">Copy</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>API Documentation</Label>
                <Button variant="outline">View Documentation</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="embed" className="space-y-4">
              <div className="space-y-2">
                <Label>Embed Code</Label>
                <Textarea 
                  className="font-mono text-sm"
                  value={`<script>
  (function(d,t) {
    var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src="https://cdn.example.com/chatbot.js";
    g.async=true;
    g.onload=function(){
      window.ChatBot.init({
        id: "chatbot123",
        token: "YOUR_TOKEN"
      });
    };
    s.parentNode.insertBefore(g,s);
  }(document,"script"));
</script>`}
                  readOnly
                  rows={10}
                />
                <Button variant="outline">Copy Code</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Launch Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="active" className="block">Activate Chatbot</Label>
                <p className="text-sm text-gray-500">Make the chatbot available to users</p>
              </div>
              <Switch id="active" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics" className="block">Enable Analytics</Label>
                <p className="text-sm text-gray-500">Track conversations and performance</p>
              </div>
              <Switch id="analytics" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="feedback" className="block">Collect User Feedback</Label>
                <p className="text-sm text-gray-500">Ask users to rate responses</p>
              </div>
              <Switch id="feedback" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleDeploy} disabled={isDeploying}>
          {isDeploying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deploying...
            </>
          ) : (
            'Deploy Chatbot'
          )}
        </Button>
      </div>
    </div>
  );
};
