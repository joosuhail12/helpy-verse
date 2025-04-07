
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';
import ChatWidgetPreview from './ChatWidgetPreview';
import { DataCollectionConfig } from '@/components/automation/chatbots/DataCollectionConfig';
import type { DataCollectionField } from '@/types/chatbot';
import { useTheme } from '@/context/ThemeContext';

const BehaviorSettings: React.FC = () => {
  const { primaryColor } = useTheme();
  
  // Welcome message
  const [welcomeMessage, setWelcomeMessage] = useState("Hi there! 👋 How can I help you today?");
  
  // Data collection
  const [collectUserData, setCollectUserData] = useState(true);
  const [selectedFields, setSelectedFields] = useState<DataCollectionField[]>([
    {
      id: 'contact_email',
      label: 'Email',
      type: 'email', 
      required: true
    },
    {
      id: 'contact_firstname',
      label: 'First Name',
      type: 'text',
      required: false
    }
  ]);
  
  // Chat interface features
  const [showTicketStatusBar, setShowTicketStatusBar] = useState(true);
  const [allowEndChat, setAllowEndChat] = useState(true);
  const [enableDeliveryReceipts, setEnableDeliveryReceipts] = useState(true);
  const [enableMessageReactions, setEnableMessageReactions] = useState(true);
  const [showAgentPresence, setShowAgentPresence] = useState(true);
  const [enableConversationRating, setEnableConversationRating] = useState(true);

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your behavior settings have been saved successfully.",
    });
  };

  const handleFieldsChange = (fields: DataCollectionField[]) => {
    setSelectedFields(fields);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-lg font-medium">Welcome Message</h2>
        <div className="space-y-2">
          <Label htmlFor="welcomeMessage">Initial Message</Label>
          <Textarea 
            id="welcomeMessage"
            placeholder="Enter the message that will be shown when the chat widget is first opened"
            className="min-h-[100px] resize-none"
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            This message will be displayed to users when they first open the chat widget.
          </p>
        </div>

        <Separator />

        <h2 className="text-lg font-medium">Data Collection</h2>
        <DataCollectionConfig 
          fields={selectedFields}
          onFieldsChange={handleFieldsChange}
          enabled={collectUserData}
          onEnabledChange={setCollectUserData}
        />

        <Separator />
        
        <h2 className="text-lg font-medium">Chat Interface Features</h2>
        <div className="space-y-4">
          {/* Ticket Status Bar */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ticketStatusBar">Show Ticket Status Bar</Label>
              <p className="text-sm text-muted-foreground">Display the current status of the ticket in the chat</p>
            </div>
            <Switch
              id="ticketStatusBar"
              checked={showTicketStatusBar}
              onCheckedChange={setShowTicketStatusBar}
            />
          </div>
          
          {/* Allow End Chat */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowEndChat">Allow Visitors to End Chat</Label>
              <p className="text-sm text-muted-foreground">Let visitors manually end their chat session</p>
            </div>
            <Switch
              id="allowEndChat"
              checked={allowEndChat}
              onCheckedChange={setAllowEndChat}
            />
          </div>
          
          {/* Enable Delivery/Read Receipts */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableDeliveryReceipts">Enable Delivery/Read Receipts</Label>
              <p className="text-sm text-muted-foreground">Show when messages are delivered and read</p>
            </div>
            <Switch
              id="enableDeliveryReceipts"
              checked={enableDeliveryReceipts}
              onCheckedChange={setEnableDeliveryReceipts}
            />
          </div>
          
          {/* Enable Message Reactions */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableMessageReactions">Enable Message Reactions</Label>
              <p className="text-sm text-muted-foreground">Allow visitors to react to agent messages with emojis</p>
            </div>
            <Switch
              id="enableMessageReactions"
              checked={enableMessageReactions}
              onCheckedChange={setEnableMessageReactions}
            />
          </div>
          
          {/* Show Agent Presence */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showAgentPresence">Show Agent Presence</Label>
              <p className="text-sm text-muted-foreground">Display agent status (online, typing) to visitors</p>
            </div>
            <Switch
              id="showAgentPresence"
              checked={showAgentPresence}
              onCheckedChange={setShowAgentPresence}
            />
          </div>
          
          {/* Enable Conversation Rating */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableConversationRating">Enable Conversation Rating</Label>
              <p className="text-sm text-muted-foreground">Allow visitors to rate their conversation experience</p>
            </div>
            <Switch
              id="enableConversationRating"
              checked={enableConversationRating}
              onCheckedChange={setEnableConversationRating}
            />
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
            showTicketStatusBar={showTicketStatusBar}
            allowEndChat={allowEndChat}
            enableMessageReactions={enableMessageReactions}
            showAgentPresence={showAgentPresence}
            enableDeliveryReceipts={enableDeliveryReceipts}
            enableConversationRating={enableConversationRating}
          />
        </div>
        <p className="text-sm text-gray-500">
          This is a preview of how your chat widget will appear to users with the current behavior settings.
        </p>
      </div>
    </div>
  );
};

export default BehaviorSettings;
