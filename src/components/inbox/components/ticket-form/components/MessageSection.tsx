
import { Label } from "@/components/ui/label";
import TicketMessageEditor from '../TicketMessageEditor';

interface MessageSectionProps {
  message: string;
  onMessageChange: (message: string) => void;
}

const MessageSection = ({ message, onMessageChange }: MessageSectionProps) => {
  return (
    <div className="border-t border-gray-100 pt-5 mt-5">
      <div className="space-y-3">
        <Label htmlFor="message" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          Initial Message <span className="text-red-500">*</span>
        </Label>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <TicketMessageEditor 
            content={message}
            onChange={onMessageChange}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
          <span className="text-muted-foreground/80">
            Type @ to mention customer, company, or ticket information.
          </span>
        </p>
      </div>
    </div>
  );
};

export default MessageSection;
