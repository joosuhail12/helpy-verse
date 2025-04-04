
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import ChatWidgetPreview from './ChatWidgetPreview';
import { DataCollectionConfig } from '@/components/automation/chatbots/DataCollectionConfig';

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
  { id: 'company_size', name: 'Company Size', type: 'number', object: 'company' },
];

const BehaviorSettings: React.FC = () => {
  // In a real implementation, these would be fetched from the backend
  const [collectUserData, setCollectUserData] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("Hi there! 👋 How can I help you today?");
  const [selectedFields, setSelectedFields] = useState([
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

  const handleSaveChanges = () => {
    // In a real implementation, we would save changes to the backend here
    toast({
      title: "Settings saved",
      description: "Your behavior settings have been saved successfully.",
    });
  };

  const handleFieldsChange = (fields) => {
    setSelectedFields(fields);
  };

  return (
    <div className="space-y-8">
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
                  enabled={collectUserData}
                  fields={selectedFields}
                  onEnableChange={setCollectUserData}
                  onFieldsChange={handleFieldsChange}
                />
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-lg font-medium">Live Preview</h2>
          <div className="border rounded-lg p-4 bg-gray-50 h-[600px] relative">
            <ChatWidgetPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorSettings;
