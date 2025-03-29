
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { Separator } from '@/components/ui/separator';

interface BehaviorTabProps {
  enableTypingIndicator: boolean;
  enableReactions: boolean;
  enableFileAttachments: boolean;
  enableReadReceipts: boolean;
  onSettingChange: (field: keyof ChatWidgetSettings, value: boolean) => void;
}

/**
 * Tab component for chat widget behavior settings
 */
const BehaviorTab = ({
  enableTypingIndicator,
  enableReactions,
  enableFileAttachments,
  enableReadReceipts,
  onSettingChange
}: BehaviorTabProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium">Interactive Features</h3>
        <p className="text-sm text-gray-500">
          Control which interactive features are enabled in your chat widget.
        </p>
        <Separator className="my-3" />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="typing-indicator">Typing Indicator</Label>
          <p className="text-xs text-gray-500">Shows when an agent is typing</p>
        </div>
        <Switch
          id="typing-indicator"
          checked={enableTypingIndicator}
          onCheckedChange={(value) => onSettingChange('enableTypingIndicator', value)}
        />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="reactions">Message Reactions</Label>
          <p className="text-xs text-gray-500">Allow users to react to messages with emojis</p>
        </div>
        <Switch
          id="reactions"
          checked={enableReactions}
          onCheckedChange={(value) => onSettingChange('enableReactions', value)}
        />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="file-attachments">File Attachments</Label>
          <p className="text-xs text-gray-500">Allow users to upload and send files</p>
        </div>
        <Switch
          id="file-attachments"
          checked={enableFileAttachments}
          onCheckedChange={(value) => onSettingChange('enableFileAttachments', value)}
        />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div>
          <Label htmlFor="read-receipts">Read Receipts</Label>
          <p className="text-xs text-gray-500">Shows when messages have been read</p>
        </div>
        <Switch
          id="read-receipts"
          checked={enableReadReceipts}
          onCheckedChange={(value) => onSettingChange('enableReadReceipts', value)}
        />
      </div>
    </div>
  );
};

export default BehaviorTab;
