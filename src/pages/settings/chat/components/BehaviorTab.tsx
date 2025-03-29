
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface BehaviorTabProps {
  enableTypingIndicator: boolean;
  enableReactions: boolean;
  enableFileAttachments: boolean;
  enableReadReceipts: boolean;
  onSettingChange: (field: keyof ChatWidgetSettings, value: boolean) => void;
}

/**
 * Tab component for behavior settings
 */
const BehaviorTab = ({ 
  enableTypingIndicator, 
  enableReactions, 
  enableFileAttachments, 
  enableReadReceipts, 
  onSettingChange 
}: BehaviorTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="typing-indicator">Typing Indicator</Label>
          <p className="text-sm text-gray-500">Show when agents are typing</p>
        </div>
        <Switch
          id="typing-indicator"
          checked={enableTypingIndicator}
          onCheckedChange={(checked) => onSettingChange('enableTypingIndicator', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="reactions">Reactions</Label>
          <p className="text-sm text-gray-500">Allow users to react to messages</p>
        </div>
        <Switch
          id="reactions"
          checked={enableReactions}
          onCheckedChange={(checked) => onSettingChange('enableReactions', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="file-attachments">File Attachments</Label>
          <p className="text-sm text-gray-500">Allow users to upload files</p>
        </div>
        <Switch
          id="file-attachments"
          checked={enableFileAttachments}
          onCheckedChange={(checked) => onSettingChange('enableFileAttachments', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="read-receipts">Read Receipts</Label>
          <p className="text-sm text-gray-500">Show when messages have been read</p>
        </div>
        <Switch
          id="read-receipts"
          checked={enableReadReceipts}
          onCheckedChange={(checked) => onSettingChange('enableReadReceipts', checked)}
        />
      </div>
    </div>
  );
};

export default BehaviorTab;
