
import React, { useState } from 'react';
import { useWidgets } from '@/hooks/useWidgets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateWidgetRequest } from '@/api/services/WidgetService';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const WidgetManager: React.FC = () => {
  const { widgets, loading, createWidget, deleteWidget } = useWidgets();
  const [newWidgetName, setNewWidgetName] = useState('');
  const [creatingWidget, setCreatingWidget] = useState(false);

  const handleCreateWidget = async () => {
    if (!newWidgetName.trim()) return;
    
    setCreatingWidget(true);
    
    // Default widget configuration
    const defaultWidgetConfig: CreateWidgetRequest = {
      name: newWidgetName,
      themeName: `${newWidgetName} Theme`,
      colors: {
        primary: '#9b87f5',
        primaryForeground: '#FFFFFF',
        background: '#FFFFFF',
        foreground: '#1A1F2C',
        border: '#E1E1E1',
        userMessage: '#9b87f5',
        userMessageText: '#FFFFFF',
        agentMessage: '#F1F1F1',
        agentMessageText: '#1A1F2C',
        inputBackground: '#F9F9F9'
      },
      position: 'bottom-right',
      labels: {
        welcomeTitle: 'Hello there!',
        welcomeSubtitle: 'How can we help you today?'
      },
      persona: 'Pullsy',
      isCompact: false
    };
    
    await createWidget(defaultWidgetConfig);
    setNewWidgetName('');
    setCreatingWidget(false);
  };

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="widgets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="widgets">Chat Widgets</TabsTrigger>
          <TabsTrigger value="themes">Widget Themes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="widgets">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Chat Widgets</h1>
            <div className="flex gap-3">
              <Input 
                placeholder="New widget name" 
                value={newWidgetName}
                onChange={(e) => setNewWidgetName(e.target.value)}
                className="w-64"
              />
              <Button 
                onClick={handleCreateWidget} 
                disabled={!newWidgetName.trim() || creatingWidget}
              >
                {creatingWidget ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Widget
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <Card key={n} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {widgets.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500 mb-4">No widgets created yet</p>
                    <Button onClick={() => document.getElementById('new-widget-name')?.focus()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create your first widget
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {widgets.map((widget) => (
                    <Card key={widget.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{widget.name}</CardTitle>
                            <CardDescription>Created: {new Date(widget.createdAt).toLocaleDateString()}</CardDescription>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteWidget(widget.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Label className="w-24 text-gray-500">Theme:</Label>
                            <span>{widget.widgettheme?.[0]?.name || 'Default'}</span>
                          </div>
                          <div className="flex items-center">
                            <Label className="w-24 text-gray-500">Position:</Label>
                            <span>{widget.widgettheme?.[0]?.position || 'bottom-right'}</span>
                          </div>
                          <div className="flex items-center">
                            <Label className="w-24 text-gray-500">Primary Color:</Label>
                            <div 
                              className="w-5 h-5 rounded-full" 
                              style={{ backgroundColor: widget.widgettheme?.[0]?.colors?.primary || '#9b87f5' }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline" asChild>
                          <a href={`/settings/widgets/${widget.id}`}>Configure Widget</a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="themes">
          <h1 className="text-2xl font-bold mb-6">Widget Themes</h1>
          <p className="text-gray-500">Themes are managed through the widget configuration.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WidgetManager;
