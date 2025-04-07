
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

// Mock data for available fields - in a real implementation, this would be fetched from the API
const AVAILABLE_FIELDS = [
  // Contact fields
  { id: 'contact_firstname', name: 'First Name', type: 'text', object: 'contact' },
  { id: 'contact_lastname', name: 'Last Name', type: 'text', object: 'contact' },
  { id: 'contact_email', name: 'Email', type: 'email', object: 'contact' },
  { id: 'contact_phone', name: 'Phone Number', type: 'phone', object: 'contact' },
  { id: 'contact_title', name: 'Job Title', type: 'text', object: 'contact' },
  { id: 'contact_timezone', name: 'Timezone', type: 'text', object: 'contact' },
  
  // Company fields
  { id: 'company_name', name: 'Company Name', type: 'text', object: 'company' },
  { id: 'company_website', name: 'Website', type: 'text', object: 'company' },
  { id: 'company_industry', name: 'Industry', type: 'text', object: 'company' },
  { id: 'company_size', name: 'Company Size', type: 'text', object: 'company' },
];

// Mock data for available tables - in a real implementation, this would be fetched from the API
const AVAILABLE_TABLES = [
  { id: 'contacts', name: 'Contacts' },
  { id: 'companies', name: 'Companies' },
  // Mock custom objects connected to contacts and companies
  { id: 'deals', name: 'Deals', connectedTo: 'contacts' },
  { id: 'products', name: 'Products', connectedTo: 'companies' },
  { id: 'projects', name: 'Projects', connectedTo: 'contacts' },
];

const BehaviorSettings: React.FC = () => {
  const { primaryColor } = useTheme();
  // In a real implementation, these would be fetched from the backend
  const [collectUserData, setCollectUserData] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("Hi there! 👋 How can I help you today?");
  
  // Chat interface features
  const [showTicketStatusBar, setShowTicketStatusBar] = useState(true);
  const [allowEndChat, setAllowEndChat] = useState(true);
  const [enableReceipts, setEnableReceipts] = useState(true);
  const [enableMessageReactions, setEnableMessageReactions] = useState(true);
  const [showAgentPresence, setShowAgentPresence] = useState(true);
  const [enableConversationRating, setEnableConversationRating] = useState(true);
  
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

  const ensureEmailFieldIsRequired = (fields: DataCollectionField[]): DataCollectionField[] => {
    const emailFieldIndex = fields.findIndex(field => field.id === 'contact_email');
    if (emailFieldIndex === -1) {
      // Email field doesn't exist, add it as required
      return [
        ...fields,
        {
          id: 'contact_email',
          label: 'Email',
          type: 'email',
          required: true
        }
      ];
    } else if (!fields[emailFieldIndex].required) {
      // Email field exists but not required, update it
      return fields.map(field => 
        field.id === 'contact_email' ? { ...field, required: true } : field
      );
    }
    return fields;
  };

  const handleSaveChanges = () => {
    // In a real implementation, we would save changes to the backend here
    toast({
      title: "Settings saved",
      description: "Your behavior settings have been saved successfully.",
    });
  };

  const handleFieldsChange = (fields: DataCollectionField[]) => {
    // Ensure the email field is always required
    const updatedFields = ensureEmailFieldIsRequired(fields);
    setSelectedFields(updatedFields);
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="collectData">Collect User Data</Label>
              <p className="text-sm text-muted-foreground">Collect information from users before starting chat</p>
            </div>
            <Switch
              id="collectData"
              checked={collectUserData}
              onCheckedChange={setCollectUserData}
            />
          </div>

          {collectUserData && (
            <div className="mt-4 border border-gray-100 rounded-md p-4 bg-gray-50">
              <DataCollectionConfig 
                fields={selectedFields}
                onFieldsChange={handleFieldsChange}
                enabled={collectUserData}
                onEnabledChange={setCollectUserData}
              />
            </div>
          )}
        </div>

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
              <Label htmlFor="allowEndChat">Allow End Chat</Label>
              <p className="text-sm text-muted-foreground">Let users end conversations manually</p>
            </div>
            <Switch
              id="allowEndChat"
              checked={allowEndChat}
              onCheckedChange={setAllowEndChat}
            />
          </div>
          
          {/* Enable Receipts */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableReceipts">Message Receipts</Label>
              <p className="text-sm text-muted-foreground">Show when messages are delivered/read</p>
            </div>
            <Switch
              id="enableReceipts"
              checked={enableReceipts}
              onCheckedChange={setEnableReceipts}
            />
          </div>
          
          {/* Enable Message Reactions */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableMessageReactions">Message Reactions</Label>
              <p className="text-sm text-muted-foreground">Allow users to react to messages with emojis</p>
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
              <Label htmlFor="showAgentPresence">Agent Presence</Label>
              <p className="text-sm text-muted-foreground">Show when agents are typing or active</p>
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
              <Label htmlFor="enableConversationRating">Conversation Rating</Label>
              <p className="text-sm text-muted-foreground">Allow users to rate conversations after completion</p>
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
