
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

/**
 * Props for the behavior tab
 */
export interface BehaviorTabProps {
  enableTypingIndicator: boolean;
  enableReactions: boolean;
  enableFileAttachments: boolean;
  enableReadReceipts: boolean;
  onSettingChange: (field: keyof ChatWidgetSettings['features'], value: boolean) => void;
}

/**
 * Component for behavior settings tab
 */
const BehaviorTab = ({
  enableTypingIndicator,
  enableReactions,
  enableFileAttachments,
  enableReadReceipts,
  onSettingChange
}: BehaviorTabProps) => {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="typing-indicator">Typing Indicator</Label>
                <p className="text-sm text-gray-500">
                  Show when agents are typing a response
                </p>
              </div>
              <Switch
                id="typing-indicator"
                checked={enableTypingIndicator}
                onCheckedChange={(value) => onSettingChange('enableTypingIndicator', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reactions">Message Reactions</Label>
                <p className="text-sm text-gray-500">
                  Allow visitors to react to messages
                </p>
              </div>
              <Switch
                id="reactions"
                checked={enableReactions}
                onCheckedChange={(value) => onSettingChange('enableReactions', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="file-attachments">File Attachments</Label>
                <p className="text-sm text-gray-500">
                  Allow visitors to upload files to the chat
                </p>
              </div>
              <Switch
                id="file-attachments"
                checked={enableFileAttachments}
                onCheckedChange={(value) => onSettingChange('enableFileAttachments', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="read-receipts">Read Receipts</Label>
                <p className="text-sm text-gray-500">
                  Show when messages have been read
                </p>
              </div>
              <Switch
                id="read-receipts"
                checked={enableReadReceipts}
                onCheckedChange={(value) => onSettingChange('enableReadReceipts', value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BehaviorTab;
