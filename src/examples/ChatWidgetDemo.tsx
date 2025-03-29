
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ChatWidgetConfig } from '@/api/chat-widget/types';
import chatWidgetAPI from '@/api/chat-widget';

/**
 * Demo component showing how to use the Chat Widget API
 */
const ChatWidgetDemo: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#9b87f5');
  
  // Initialize the chat widget on component mount
  useEffect(() => {
    const initWidget = async () => {
      // Configure the widget
      const config: ChatWidgetConfig = {
        workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
        theme: {
          colors: {
            primary: primaryColor
          },
          position: 'right',
          compact: false
        },
        labels: {
          welcomeTitle: 'Welcome to Demo Chat',
          welcomeSubtitle: 'Try out the chat widget API'
        },
        features: {
          typingIndicator: true,
          fileAttachments: true
        },
        events: {
          onMessageReceived: (message) => {
            console.log('New message received:', message);
          }
        }
      };
      
      // Initialize the widget
      const success = await chatWidgetAPI.initialize(config);
      setInitialized(success);
    };
    
    initWidget();
  }, []);
  
  // Load messages
  const handleLoadMessages = async () => {
    try {
      const fetchedMessages = await chatWidgetAPI.message.getAll();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };
  
  // Send a message
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    try {
      await chatWidgetAPI.message.send(messageText);
      setMessageText('');
      // Refresh messages
      handleLoadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  // Add attachment
  const handleAddAttachment = async () => {
    if (!fileUrl.trim()) return;
    
    try {
      await chatWidgetAPI.attachments.add({
        id: Date.now().toString(),
        name: fileUrl.split('/').pop() || 'file',
        type: 'image/jpeg',
        url: fileUrl,
        size: 0
      });
      setFileUrl('');
    } catch (error) {
      console.error('Failed to add attachment:', error);
    }
  };
  
  // Remove all attachments
  const handleRemoveAttachments = async () => {
    try {
      const attachments = await chatWidgetAPI.attachments.getAll();
      for (const attachment of attachments) {
        await chatWidgetAPI.attachments.remove(attachment.id);
      }
    } catch (error) {
      console.error('Failed to remove attachments:', error);
    }
  };
  
  // Toggle widget visibility
  const handleToggleWidget = async () => {
    try {
      await chatWidgetAPI.widget.toggle();
    } catch (error) {
      console.error('Failed to toggle widget:', error);
    }
  };
  
  // Update theme
  const handleUpdateTheme = async () => {
    try {
      await chatWidgetAPI.theme.update({
        colors: {
          primary: primaryColor
        }
      });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Chat Widget API Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="control">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="control">Controls</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="control" className="space-y-4 py-4">
            <div>
              <p className="mb-2">Widget Status: {initialized ? 'Initialized' : 'Not Initialized'}</p>
              <div className="flex gap-2">
                <Button onClick={handleToggleWidget}>Toggle Widget</Button>
                <Button variant="outline" onClick={() => chatWidgetAPI.widget.open()}>Open Widget</Button>
                <Button variant="outline" onClick={() => chatWidgetAPI.widget.close()}>Close Widget</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="messaging" className="space-y-4 py-4">
            <div>
              <Button onClick={handleLoadMessages} className="mb-4">Load Messages</Button>
              <div className="border rounded-md p-4 h-40 overflow-y-auto mb-4">
                {messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <div key={idx} className="mb-2">
                      <strong>{msg.sender}:</strong> {msg.content}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No messages yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message" 
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="space-y-4 py-4">
            <div>
              <p className="mb-2">Add Attachment</p>
              <div className="flex gap-2 mb-4">
                <Input 
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="File URL" 
                />
                <Button onClick={handleAddAttachment}>Add</Button>
              </div>
              <Button variant="outline" onClick={handleRemoveAttachments}>
                Remove All Attachments
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="theme" className="space-y-4 py-4">
            <div>
              <p className="mb-2">Change Primary Color</p>
              <div className="flex gap-2">
                <Input 
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20"
                />
                <Input 
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#9b87f5" 
                />
                <Button onClick={handleUpdateTheme}>Update Theme</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChatWidgetDemo;
