
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import BrandingSettings from './chat/BrandingSettings';
import BehaviorSettings from './chat/BehaviorSettings';
import InstallationGuide from './chat/InstallationGuide';
import { ThemeProvider } from '@/context/ThemeContext';

const Chat: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('branding');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <ThemeProvider>
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Chat Widget</h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Widget Settings</CardTitle>
            <CardDescription>
              Customize your chat widget appearance, behavior, and get installation instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="behavior">Behavior</TabsTrigger>
                <TabsTrigger value="installation">Installation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="branding">
                <BrandingSettings />
              </TabsContent>
              
              <TabsContent value="behavior">
                <BehaviorSettings />
              </TabsContent>
              
              <TabsContent value="installation">
                <InstallationGuide />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
};

export default Chat;
