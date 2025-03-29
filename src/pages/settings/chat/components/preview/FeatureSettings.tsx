
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { MessageSquare, Clock, ThumbsUp, Paperclip, Eye } from 'lucide-react';

interface FeatureSettingsProps {
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
}

const FeatureSettings: React.FC<FeatureSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium">Core Features</Label>
        
        <div className="grid gap-4 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-1.5 rounded-md">
                <MessageSquare className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <Label htmlFor="typing-indicator" className="text-sm font-medium">
                  Typing Indicator
                </Label>
                <p className="text-xs text-gray-500">
                  Show when agent is typing
                </p>
              </div>
            </div>
            <Switch 
              id="typing-indicator" 
              checked={settings.enableTypingIndicator} 
              onCheckedChange={(checked) => onSettingChange('enableTypingIndicator', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 rounded-md">
                <ThumbsUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <Label htmlFor="reactions" className="text-sm font-medium">
                  Message Reactions
                </Label>
                <p className="text-xs text-gray-500">
                  Allow emoji reactions on messages
                </p>
              </div>
            </div>
            <Switch 
              id="reactions" 
              checked={settings.enableReactions} 
              onCheckedChange={(checked) => onSettingChange('enableReactions', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-md">
                <Paperclip className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <Label htmlFor="file-attachments" className="text-sm font-medium">
                  File Attachments
                </Label>
                <p className="text-xs text-gray-500">
                  Allow users to send files
                </p>
              </div>
            </div>
            <Switch 
              id="file-attachments" 
              checked={settings.enableFileAttachments} 
              onCheckedChange={(checked) => onSettingChange('enableFileAttachments', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-1.5 rounded-md">
                <Eye className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <Label htmlFor="read-receipts" className="text-sm font-medium">
                  Read Receipts
                </Label>
                <p className="text-xs text-gray-500">
                  Show when messages are read
                </p>
              </div>
            </div>
            <Switch 
              id="read-receipts" 
              checked={settings.enableReadReceipts} 
              onCheckedChange={(checked) => onSettingChange('enableReadReceipts', checked)}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-3 border-t border-gray-100">
        <Label className="text-xs font-medium mb-2 block">Response Time</Label>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1.5 rounded-md">
            <Clock className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <Select 
              value={settings.responseTime} 
              onValueChange={(value) => onSettingChange('responseTime', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select response time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quick">Quick (&lt;5 min)</SelectItem>
                <SelectItem value="medium">Medium (&lt;15 min)</SelectItem>
                <SelectItem value="slow">Slow (&lt;1 hour)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 pl-8">
          Sets expectation for how quickly users will receive a response
        </p>
      </div>
    </div>
  );
};

export default FeatureSettings;
